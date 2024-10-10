import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFile } from "./s3-getFile";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";

import { getEmbedding } from "./embedding";
import md5 from "md5";
import { Vector } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/data";
import { text } from "stream/consumers";

type PDFPAGE = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

let pineconeClient: Pinecone | null = null;

function getPinecone() {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY as string,
    });
  }
  return pineconeClient;
}

export async function s3ToPineCone(file_key: string) {
  // get File form S3
  console.log("Downloading File from S3...");
  const fileName = await downloadFile(file_key);

  if (!fileName) {
    throw new Error("Error while Downloading file");
  }

  //extract the text
  const loader = new PDFLoader(fileName);
  const pages = (await loader.load()) as PDFPAGE[];

  //split the page and make chunks
  const documents = await Promise.all(pages.map(prepareDocument));

  //Embed text and get vectors
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // upload to pinecone DB

  const client = await getPinecone();
  //Remove non ascii character
  const pineConeIndex = await client.index("pdf");
  const nameSpace = pineConeIndex.namespace(removeNonAsciiCharacters(file_key));

  await nameSpace.upsert(vectors);

  return documents[0];
}

async function embedDocument(doc: Document) {
  try {
    const embedding = await getEmbedding(doc.pageContent);
    const hash = md5(doc.pageContent);

    const metadata = {
      text: await doc.metadata.text,
      pageNumber: await doc.metadata.pageNumber,
    };

    return {
      id: hash,
      values: embedding,
      metadata: metadata,
    } as PineconeRecord;
  } catch (error) {
    console.log("🚀 ~ embedDocument ~ error:", error);
    throw error;
  }
}

function truncateStringByBytes(str: string, bytes: number) {
  const enc = new TextEncoder();

  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
}

export async function prepareDocument(page: PDFPAGE) {
  let { pageContent, metadata } = page;

  pageContent = pageContent.replace(/\n/g, "");

  const splitter = new RecursiveCharacterTextSplitter();

  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  const chunkedDocs = docs.map((doc) => {
    return {
      ...doc,
      metadata: {
        ...doc.metadata,
        text: truncateStringByBytes(doc.pageContent, 36000),
      },
    };
  });

  return chunkedDocs;
}

export function removeNonAsciiCharacters(file_key: string) {
  const asciiString = file_key.replace(/[^\x00-\x7F]+/g, "");
  console.log("🚀 ~ removeNonAsciiCharacters ~ asciiString:", asciiString)
  return asciiString;
}
