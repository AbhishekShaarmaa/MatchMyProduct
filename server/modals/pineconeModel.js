import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const { GEMINI_API_KEY, OPENAI_API_KEY } = process.env;

console.log("12", OPENAI_API_KEY);

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

// Initialize Pinecone client

class GeminiEmbeddings {
  async embedQuery(data) {
    const result = await model.embedContent(data);
    console.log(result.embedding.values);
    return result.embedding.values;
  }

  async embedDocuments(data) {
    console.log("data", typeof data, data);
    try {
      for (const content of data) {
        return this.embedQuery(content);
      }
    } catch (error) {
      console.log("error", error.message);
    } // Ensure this matches the API response structure
  }
}

export async function storeProductInPinecone(id, description) {
  // console.log(id, description, "\n\n\n\n");
  const docs = [];
  docs.push({ pageContent: description, metadata: id.toString() });
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0,
  });

  const chunkedDocs = await textSplitter.splitDocuments(docs);
  const embeddings = new GeminiEmbeddings();

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const namespace = "product-matcher";
  const index = pinecone.Index("products").namespace(namespace);
  const embedding = await Promise.all(
    chunkedDocs.map(async (doc, index) => ({
      id: `${id}-${index}`,
      values: await embeddings.embedQuery(doc.pageContent),
      metadata: doc.metadata,
    }))
  );

  console.log(embedding.map((e) => e.metadata.loc));
  console.log("71", embeddings.embedQuery(description));

  try {
    await index.upsert([
      {
        id,
        values: await embeddings.embedQuery(description),
      },
    ]);

    // console.log(
    //   await index.query({
    //     vector: embeddings.embedQuery("bag for school"),
    //     topK: 3,
    //     includeValues: true,
    //   })
    // );
  } catch (err) {
    console.log("80", err);
  }

  // console.log(chunkedDocs);

  // await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
  //   pineconeIndex: index,
  //   namespace: namespace,
  //   textKey: "text",
  // });
  // // I want to add setInterval of 5 seconds

  // await delay(5000);
  // const results = await index.namespace(namespace).listPaginated();
  // const vecIds = [];

  // if (results.vectors) {
  //   for (const vector of results.vectors) {
  //     if (vector.id) vecIds.push(vector.id);
  //   }
  // }
  // res.json({ success: true, vecIds: vecIds });
}

export const productMatching = async (id, description) => {
  try {
    const docs = [];
    docs.push({ pageContent: description, metadata: id.toString() });
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 0,
    });

    const chunkedDocs = await textSplitter.splitDocuments(docs);
    const embeddings = new GeminiEmbeddings();

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const namespace = "product-matcher";
    const index = pinecone.Index("products").namespace(namespace);
    const embedding = await Promise.all(
      chunkedDocs.map(async (doc, index) => ({
        id: `${id}-${index}`,
        values: await embeddings.embedQuery(doc.pageContent),
        metadata: doc.metadata,
      }))
    );

    console.log(embedding.map((e) => e.metadata.loc));
    console.log("71", embeddings.embedQuery(description));

    try {
      // matches = await index.query({
      //   vector: await embeddings.embedQuery(description),
      //   topK: 3,
      //   includeValues: true,
      // });

      console.log(
        "141",
        await index.query({
          vector: await embeddings.embedQuery(description),
          topK: 2,
          includeValues: true,
        })
      );

      const result = await index.query({
        vector: await embeddings.embedQuery(description),
        topK: 4,
        includeValues: true,
      });

      // Extract the matches array
      const matchesArray = result.matches;

      // Map over the matches array to extract IDs
      const matchIds = matchesArray.map((match) => match.id);

      console.log("Matched IDs:", matchIds);

      // You can now return or use the matchIds variable
      return matchIds;
    } catch (err) {
      console.log("79", err);
    }
  } catch (error) {}
};
