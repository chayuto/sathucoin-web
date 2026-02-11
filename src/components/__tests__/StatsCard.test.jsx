import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatsCard from "../StatsCard";

describe("StatsCard", () => {
  it("renders label and value", () => {
    render(<StatsCard label="Total Supply" value="1,000 SATHU" />);
    expect(screen.getByText("Total Supply")).toBeInTheDocument();
    expect(screen.getByText("1,000 SATHU")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <StatsCard label="Test" value="123" className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
