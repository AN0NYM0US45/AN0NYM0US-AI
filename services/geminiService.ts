import { GoogleGenAI, Modality } from "@google/genai";

// As per guidelines, the API key is sourced from environment variables.
// The Vite config handles making this available in the client-side code.
const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

/**
 * Enhances an image using the Gemini API with a studio effect.
 * @param base64ImageData The base64-encoded image data string.
 * @param mimeType The IANA MIME type of the image (e.g., 'image/jpeg').
 * @returns A promise that resolves to the base64-encoded string of the enhanced image.
 * @throws An error if the API call fails or returns no image.
 */
export const enhanceImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
  if (!apiKey) {
    // This check is now inside the function, preventing the app from crashing on load.
    throw new Error("VITE_API_KEY environment variable not set. Please configure it in your deployment settings.");
  }

  // Per guidelines, use 'gemini-2.5-flash-image-preview' for image editing.
  const model = 'gemini-2.5-flash-image-preview';
  const prompt = "TASK: Enhance image to 4K resolution.\nOBJECTIVE: Convert a standard photo into a professional, ultra-high-resolution studio-quality photograph suitable for large prints and digital displays.\n\nTECHNICAL REQUIREMENTS:\n1.  **Target Resolution: 4K UHD.** Render the output at a 4K UHD resolution (e.g., 3840x2160 pixels or an equivalent aspect ratio). Intelligently upscale the original content to fit these new dimensions without losing quality.\n2.  **Detail Enhancement:** Analyze the original image and significantly increase the level of detail and clarity. Textures on fabrics, skin, and surfaces should become tack-sharp.\n3.  **Noise & Artifact Removal:** Aggressively remove any digital noise, compression artifacts (like JPEG blocking), and color banding from the original image.\n4.  **Advanced Sharpening:** Apply a sophisticated sharpening algorithm that targets the edges of the primary subject, making it 'pop' from the background without creating halos or an over-sharpened look.\n\nARTISTIC REQUIREMENTS:\n5.  **Studio Lighting:** Re-light the scene to mimic a professional studio setup. Introduce a clear key light, subtle fill lights, and a rim light to create depth and dimension.\n6.  **Color Grading:** Apply a rich, cinematic color grade. Enhance the dynamic range, deepen the blacks, and ensure the highlights are clean and vibrant without being blown out.\n7.  **Natural Bokeh:** If a background is present, render a soft, natural-looking background blur (bokeh) that emulates a wide-aperture lens from a high-end studio camera. The subject must remain perfectly in focus.";

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      // Per guidelines, both IMAGE and TEXT modalities are required for image editing.
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // Extract the enhanced image data from the first candidate, following the guideline example.
    const candidate = response.candidates?.[0];
    if (candidate) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          return part.inlineData.data;
        }
      }
    }

    // If no image is returned, check for a text response which might be an error or explanation.
    const textResponse = response.text;
    if (textResponse) {
      throw new Error(`Image enhancement failed: ${textResponse.trim()}`);
    }

    throw new Error("Enhancement failed: No image data was returned from the API.");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      const errorMessage = error.message;

      // Check for the specific quota error string. This is safer than always parsing JSON.
      if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('"code":429')) {
        throw new Error("API usage limit reached. This could be the free daily quota (which resets at midnight UTC) or a rate limit. Please wait and try again later.");
      }

      // For other errors, try to extract a cleaner message if it's JSON.
      try {
        const errorDetails = JSON.parse(errorMessage);
        if (errorDetails?.error?.message) {
          // Return a cleaner message from the API error object.
          throw new Error(`Image enhancement failed: ${errorDetails.error.message}`);
        }
      } catch (e) {
        // Not a JSON error message, fall through to the default behavior below.
      }
      
      // Default behavior for other errors.
      throw new Error(`API request failed: ${errorMessage}`);
    }
    // Fallback for non-Error types.
    throw new Error("An unknown error occurred during the API request.");
  }
};