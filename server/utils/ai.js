import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: "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",
});

// Arrow function to extract product description
export const extractProductDescription = async (url) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
              Analyze the bag in the provided image and generate a detailed, structured product description. Include the following details:  
              1. *Category*: Specify the type of bag (e.g., backpack, handbag, duffel, etc.).  
              2. *Material*: Describe the material(s) used (e.g., leather, nylon, polyester, canvas).  
              3. *Color*: Clearly state the primary color and any additional accents or patterns.  
              4. *Size and Dimensions*: Provide approximate size or dimensions, if visually discernible.  
              5. *Design Features*: Highlight key design elements (e.g., shape, compartments, zippers, straps).  
              6. *Usage*: Describe the intended use (e.g., travel, school, work, casual, formal).  
              7. *Additional Attributes*: Note any standout attributes, such as water resistance, padded compartments, or adjustable straps.  
              
              If the image does not contain any bag product, return: "The image does not contain any bag-related product."and do not provide any description related to image and your response string should contain less then 40 words 
              `,
            },
            {
              type: "image_url",
              image_url: {
                url,
              }, // Use the passed URL here
            },
          ],
        },
      ],
      model: "llama-3.2-11b-vision-preview",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });
    const description = chatCompletion.choices[0].message.content;

    if (
      description.split(" ").length < 60 ||
      description === "the image does not contain any bag-related product."
    ) {
      return "The image does not contain any bag-related product.";
    }

    return chatCompletion.choices[0].message.content; // Return the extracted description
  } catch (error) {
    console.error("Error extracting product description:", error.message);
    throw error;
  }
};
