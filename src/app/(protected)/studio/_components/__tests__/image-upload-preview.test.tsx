import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ImageUploadPreview from "../image-upload-preview";

describe("ImageUploadPreview", () => {
  const mockOnUpload = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders upload area when no image is provided", () => {
    render(<ImageUploadPreview image={null} onUpload={mockOnUpload} onClear={mockOnClear} />);

    expect(screen.getByText(/drag & drop/i)).toBeInTheDocument();
    expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
  });

  it("renders image preview when image is provided", () => {
    const testImage = "data:image/png;base64,test";
    render(<ImageUploadPreview image={testImage} onUpload={mockOnUpload} onClear={mockOnClear} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", testImage);
  });

  it("calls onUpload when file is selected", () => {
    render(<ImageUploadPreview image={null} onUpload={mockOnUpload} onClear={mockOnClear} />);

    const input = screen.getByLabelText(/upload/i) as HTMLInputElement;
    const file = new File(["dummy"], "test.png", { type: "image/png" });

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockOnUpload).toHaveBeenCalled();
  });

  it("calls onClear when clear button is clicked", () => {
    const testImage = "data:image/png;base64,test";
    render(<ImageUploadPreview image={testImage} onUpload={mockOnUpload} onClear={mockOnClear} />);

    const clearButton = screen.getByRole("button", { name: /clear/i });
    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalled();
  });

  it("accepts only image files", () => {
    render(<ImageUploadPreview image={null} onUpload={mockOnUpload} onClear={mockOnClear} />);

    const input = screen.getByLabelText(/upload/i) as HTMLInputElement;
    expect(input).toHaveAttribute("accept", "image/*");
  });

  it("shows upload icon when no image", () => {
    render(<ImageUploadPreview image={null} onUpload={mockOnUpload} onClear={mockOnClear} />);

    expect(screen.getByTestId("upload-icon")).toBeInTheDocument();
  });
});
