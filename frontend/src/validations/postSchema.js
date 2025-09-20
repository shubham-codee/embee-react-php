import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be between 5 and 150 characters.")
    .max(150, "Title must be between 5 and 150 characters."),

  content: z
    .string()
    .trim()
    .min(20, "Content is too short. Please write more."),
});

const allowedExtensions = ["jpg", "jpeg", "png", "img"];

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, {
    message: "No file selected.",
  })
  .refine(
    (file) =>
      allowedExtensions.includes(file.name.split(".").pop().toLowerCase()),
    {
      message: "Invalid file type. Only JPG, JPEG, PNG, IMG are allowed.",
    }
  )
  .refine((file) => file.type.startsWith("image/"), {
    message: "Uploaded file is not a valid image.",
  });
