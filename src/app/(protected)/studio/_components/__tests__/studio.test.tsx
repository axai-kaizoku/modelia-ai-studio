import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import StudioPage from "../studio";
import { generateImage, getAllGenerations } from "@/server/api/generate/actions";
import "@testing-library/jest-dom";

jest.mock("@/server/api/generate/actions", () => ({
  generateImage: jest.fn(),
  getAllGenerations: jest.fn(),
}));

const mockGenerateImage = generateImage as jest.MockedFunction<typeof generateImage>;
const mockGetAllGenerations = getAllGenerations as jest.MockedFunction<typeof getAllGenerations>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("StudioPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllGenerations.mockResolvedValue({
      error: false,
      data: [],
    });
  });

  describe("Component Rendering", () => {
    it("renders upload section", () => {
      render(<StudioPage userEmail="test@example.com" />, { wrapper: createWrapper() });

      expect(screen.getByText("Upload Image")).toBeInTheDocument();
    });

    it("renders prompt and style sections after image upload", async () => {
      render(<StudioPage userEmail="test@example.com" />, { wrapper: createWrapper() });

      const file = new File(["dummy"], "test.png", { type: "image/png" });
      const input = screen.getByLabelText(/upload/i) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText("Generation Settings")).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/describe the style/i)).toBeInTheDocument();
        expect(screen.getByText("Style")).toBeInTheDocument();
      });
    });

    it("displays user email in header", () => {
      render(<StudioPage userEmail="test@example.com" />, { wrapper: createWrapper() });

      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });
  });

  describe("File Upload", () => {
    it("accepts valid image files under 8MB", async () => {
      render(<StudioPage userEmail="test@example.com" />, { wrapper: createWrapper() });

      const file = new File(["x".repeat(1024 * 1024)], "test.png", { type: "image/png" });
      const input = screen.getByLabelText(/upload/i) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText("Generation Settings")).toBeInTheDocument();
      });
    });

    it("rejects files larger than 8MB", async () => {
      render(<StudioPage userEmail="test@example.com" />, { wrapper: createWrapper() });

      const file = new File(["x".repeat(9 * 1024 * 1024)], "large.png", { type: "image/png" });
      const input = screen.getByLabelText(/upload/i) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("File size must be less than 8MB");
      });
    });

    it("clears uploaded image when clear button is clicked", async () => {
      render(<StudioPage userEmail="test@example.com" />, { wrapper: createWrapper() });

      const file = new File(["dummy"], "test.png", { type: "image/png" });
      const input = screen.getByLabelText(/upload/i) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText("Generation Settings")).toBeInTheDocument();
      });

      const clearButton = screen.getByRole("button", { name: /clear/i });
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.queryByText("Generation Settings")).not.toBeInTheDocument();
      });
    });
  });

  describe("Generate Flow", () => {
    it("shows loading state during generation", async () => {
      mockGenerateImage.mockImplementation(() => new Promise(() => {}));

      render(<StudioPage userEmail="test@example.com" />, { wrapper: createWrapper() });

      const file = new File(["dummy"], "test.png", { type: "image/png" });
      const input = screen.getByLabelText(/upload/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/describe the style/i)).toBeInTheDocument();
      });

      const promptInput = screen.getByPlaceholderText(/describe the style/i);
      fireEvent.change(promptInput, { target: { value: "A beautiful dress" } });

      const generateButton = screen.getByRole("button", { name: /generate image/i });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(screen.getByText(/generating/i)).toBeInTheDocument();
      });
    });

    it("shows success message and updates history on successful generation", async () => {
      const mockGeneration = {
        id: "1",
        userId: "user1",
        prompt: "A beautiful dress",
        style: "fashion",
        imageUrl: "https://example.com/image.jpg",
        status: "completed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockGenerateImage.mockResolvedValue({
        error: false,
        data: mockGeneration,
      });

      mockGetAllGenerations.mockResolvedValue({
        error: false,
        data: [mockGeneration],
      });

      render(<StudioPage userEmail="test@example.com" />, { wrapper: createWrapper() });

      const file = new File(["dummy"], "test.png", { type: "image/png" });
      const input = screen.getByLabelText(/upload/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/describe the style/i)).toBeInTheDocument();
      });

      const promptInput = screen.getByPlaceholderText(/describe the style/i);
      fireEvent.change(promptInput, { target: { value: "A beautiful dress" } });

      const generateButton = screen.getByRole("button", { name: /generate image/i });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Image generated successfully!");
      });
    });

    it("requires both image and prompt before generating", async () => {
      render(<StudioPage userEmail="test@example.com" />, { wrapper: createWrapper() });

      const file = new File(["dummy"], "test.png", { type: "image/png" });
      const input = screen.getByLabelText(/upload/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/describe the style/i)).toBeInTheDocument();
      });

      const generateButton = screen.getByRole("button", { name: /generate image/i });
      expect(generateButton).toBeDisabled();
    });
  });

  describe("Error and Retry Handling", () => {
    it("shows error message on generation failure", async () => {
      mockGenerateImage.mockResolvedValue({
        error: true,
        message: "Generation failed",
      });

      render(<StudioPage userEmail="test@example.com" />, { wrapper: createWrapper() });

      const file = new File(["dummy"], "test.png", { type: "image/png" });
      const input = screen.getByLabelText(/upload/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/describe the style/i)).toBeInTheDocument();
      });

      const promptInput = screen.getByPlaceholderText(/describe the style/i);
      fireEvent.change(promptInput, { target: { value: "A beautiful dress" } });

      const generateButton = screen.getByRole("button", { name: /generate image/i });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Generation failed");
      });
    });

    it("shows retry UI after first failure", async () => {
      mockGenerateImage.mockResolvedValue({
        error: true,
        message: "Model overloaded",
      });

      render(<StudioPage userEmail="test@example.com" />, { wrapper: createWrapper() });

      const file = new File(["dummy"], "test.png", { type: "image/png" });
      const input = screen.getByLabelText(/upload/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/describe the style/i)).toBeInTheDocument();
      });

      const promptInput = screen.getByPlaceholderText(/describe the style/i);
      fireEvent.change(promptInput, { target: { value: "A beautiful dress" } });

      const generateButton = screen.getByRole("button", { name: /generate image/i });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(screen.getByText(/attempt 1 of 3/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
      });
    });

    it("allows retry up to 3 attempts", async () => {
      mockGenerateImage.mockResolvedValue({
        error: true,
        message: "Model overloaded",
      });

      render(<StudioPage userEmail="test@example.com" />, { wrapper: createWrapper() });

      const file = new File(["dummy"], "test.png", { type: "image/png" });
      const input = screen.getByLabelText(/upload/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/describe the style/i)).toBeInTheDocument();
      });

      const promptInput = screen.getByPlaceholderText(/describe the style/i);
      fireEvent.change(promptInput, { target: { value: "A beautiful dress" } });

      const generateButton = screen.getByRole("button", { name: /generate image/i });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(screen.getByText(/attempt 1 of 3/i)).toBeInTheDocument();
      });

      const retryButton = screen.getByRole("button", { name: /retry/i });
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText(/attempt 2 of 3/i)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: /retry/i }));

      await waitFor(() => {
        expect(screen.getByText(/max retries reached/i)).toBeInTheDocument();
      });
    });
  });

  describe("Abort Functionality", () => {
    it("shows abort button during generation", async () => {
      mockGenerateImage.mockImplementation(() => new Promise(() => {}));

      render(<StudioPage userEmail="test@example.com" />, { wrapper: createWrapper() });

      const file = new File(["dummy"], "test.png", { type: "image/png" });
      const input = screen.getByLabelText(/upload/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/describe the style/i)).toBeInTheDocument();
      });

      const promptInput = screen.getByPlaceholderText(/describe the style/i);
      fireEvent.change(promptInput, { target: { value: "A beautiful dress" } });

      const generateButton = screen.getByRole("button", { name: /generate image/i });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /abort generation/i })).toBeInTheDocument();
      });
    });

    it("cancels generation when abort is clicked", async () => {
      let abortCalled = false;
      mockGenerateImage.mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (abortCalled) {
              reject(new Error("Aborted"));
            } else {
              resolve({ error: false, data: {} as any });
            }
          }, 1000);
        });
      });

      render(<StudioPage userEmail="test@example.com" />, { wrapper: createWrapper() });

      const file = new File(["dummy"], "test.png", { type: "image/png" });
      const input = screen.getByLabelText(/upload/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/describe the style/i)).toBeInTheDocument();
      });

      const promptInput = screen.getByPlaceholderText(/describe the style/i);
      fireEvent.change(promptInput, { target: { value: "A beautiful dress" } });

      const generateButton = screen.getByRole("button", { name: /generate image/i });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /abort generation/i })).toBeInTheDocument();
      });

      const abortButton = screen.getByRole("button", { name: /abort generation/i });
      fireEvent.click(abortButton);
      abortCalled = true;

      await waitFor(() => {
        expect(screen.queryByText(/generating/i)).not.toBeInTheDocument();
      });
    });
  });
});
