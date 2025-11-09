import { render, screen } from "@testing-library/react";
import GenerationResult from "../generation-result";

describe("GenerationResult", () => {
  const mockResult = {
    id: "1",
    originalImage: "data:image/png;base64,original",
    prompt: "A beautiful summer dress",
    style: "fashion",
    resultImage: "data:image/png;base64,result",
    timestamp: new Date("2024-01-01T12:00:00Z"),
  };

  it("renders result image", () => {
    render(<GenerationResult result={mockResult} />);

    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
  });

  it("displays prompt text", () => {
    render(<GenerationResult result={mockResult} />);

    expect(screen.getByText(mockResult.prompt)).toBeInTheDocument();
  });

  it("displays style", () => {
    render(<GenerationResult result={mockResult} />);

    expect(screen.getByText(new RegExp(mockResult.style, "i"))).toBeInTheDocument();
  });

  it("shows download button", () => {
    render(<GenerationResult result={mockResult} />);

    expect(screen.getByRole("button", { name: /download/i })).toBeInTheDocument();
  });

  it("formats timestamp correctly", () => {
    render(<GenerationResult result={mockResult} />);

    // Check if any date-related text is present
    expect(screen.getByText(/jan|january|2024/i)).toBeInTheDocument();
  });
});
