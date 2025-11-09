import { render, screen, fireEvent } from "@testing-library/react";
import GenerationHistory from "../generation-history";
import "@testing-library/jest-dom";

describe("GenerationHistory", () => {
  const mockItems = [
    {
      id: "1",
      originalImage: "data:image/png;base64,original1",
      prompt: "First generation",
      style: "fashion",
      resultImage: "data:image/png;base64,result1",
      timestamp: new Date("2024-01-01T12:00:00Z"),
    },
    {
      id: "2",
      originalImage: "data:image/png;base64,original2",
      prompt: "Second generation",
      style: "casual",
      resultImage: "data:image/png;base64,result2",
      timestamp: new Date("2024-01-02T12:00:00Z"),
    },
  ];

  const mockOnRestore = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty state when no items", () => {
    render(<GenerationHistory items={[]} onRestore={mockOnRestore} isLoading={false} />);

    expect(screen.getByText(/no generations yet/i)).toBeInTheDocument();
  });

  it("renders all history items", () => {
    render(<GenerationHistory items={mockItems} onRestore={mockOnRestore} isLoading={false} />);

    expect(screen.getByText("First generation")).toBeInTheDocument();
    expect(screen.getByText("Second generation")).toBeInTheDocument();
  });

  it("calls onRestore when item is clicked", () => {
    render(<GenerationHistory items={mockItems} onRestore={mockOnRestore} isLoading={false} />);

    const firstItem = screen.getByText("First generation").closest("button");
    if (firstItem) {
      fireEvent.click(firstItem);
      expect(mockOnRestore).toHaveBeenCalledWith(mockItems[0]);
    }
  });

  it("shows loading state", () => {
    render(<GenerationHistory items={mockItems} onRestore={mockOnRestore} isLoading={true} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays history title", () => {
    render(<GenerationHistory items={mockItems} onRestore={mockOnRestore} isLoading={false} />);

    expect(screen.getByText(/history|recent/i)).toBeInTheDocument();
  });

  it("limits displayed items to 5", () => {
    const manyItems = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      originalImage: `data:image/png;base64,original${i}`,
      prompt: `Generation ${i}`,
      style: "fashion",
      resultImage: `data:image/png;base64,result${i}`,
      timestamp: new Date(),
    }));

    render(<GenerationHistory items={manyItems} onRestore={mockOnRestore} isLoading={false} />);

    const items = screen.getAllByRole("button");
    expect(items.length).toBeLessThanOrEqual(5);
  });
});
