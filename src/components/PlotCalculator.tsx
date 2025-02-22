
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface PlotDimensions {
  back: number;
  left: number;
  right: number;
  front: number;
}

export const PlotCalculator = () => {
  const [dimensions, setDimensions] = useState<PlotDimensions>({
    back: 0,
    left: 0,
    right: 0,
    front: 0,
  });
  const [unit, setUnit] = useState<"feet" | "yards">("feet");
  const [result, setResult] = useState<string>("");

  const handleInputChange = (side: keyof PlotDimensions, value: string) => {
    setDimensions((prev) => ({
      ...prev,
      [side]: parseFloat(value) || 0,
    }));
  };

  const calculateArea = () => {
    const { back, left, right, front } = dimensions;
    if ([back, left, right, front].some((dim) => dim <= 0)) {
      toast.error("Please enter valid values for all sides");
      return;
    }

    let convertedDimensions = { ...dimensions };
    if (unit === "yards") {
      Object.keys(convertedDimensions).forEach((key) => {
        convertedDimensions[key as keyof PlotDimensions] *= 3;
      });
    }

    const avgWidth = (convertedDimensions.back + convertedDimensions.front) / 2;
    const avgHeight = (convertedDimensions.left + convertedDimensions.right) / 2;
    const area = avgWidth * avgHeight;
    const marla = area / 272;

    setResult(`${area.toFixed(2)} sq ft (${marla.toFixed(2)} marla)`);
    toast.success("Area calculated successfully!");
  };

  const calculateMissingSide = () => {
    const sides = Object.entries(dimensions);
    const missingSide = sides.find(([, value]) => value === 0);
    const knownSides = sides.filter(([, value]) => value > 0);

    if (!missingSide || knownSides.length !== 3) {
      toast.error("Please provide exactly three sides");
      return;
    }

    const avgValue =
      knownSides.reduce((sum, [, value]) => sum + value, 0) / knownSides.length;

    setDimensions((prev) => ({
      ...prev,
      [missingSide[0]]: avgValue,
    }));

    toast.success(`Estimated ${missingSide[0]} side: ${avgValue.toFixed(2)} ${unit}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass rounded-2xl p-8 space-y-6"
      >
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Plot Measurement</h2>
          <p className="text-sm text-muted-foreground">
            Enter the dimensions to calculate the plot area
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Back Side</label>
            <Input
              type="number"
              value={dimensions.back || ""}
              onChange={(e) => handleInputChange("back", e.target.value)}
              placeholder="Value"
              className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Front Side</label>
            <Input
              type="number"
              value={dimensions.front || ""}
              onChange={(e) => handleInputChange("front", e.target.value)}
              placeholder="Value"
              className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Left Side</label>
            <Input
              type="number"
              value={dimensions.left || ""}
              onChange={(e) => handleInputChange("left", e.target.value)}
              placeholder="Value"
              className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Right Side</label>
            <Input
              type="number"
              value={dimensions.right || ""}
              onChange={(e) => handleInputChange("right", e.target.value)}
              placeholder="Value"
              className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Unit</label>
          <Select value={unit} onValueChange={(value: "feet" | "yards") => setUnit(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="feet">Feet</SelectItem>
              <SelectItem value="yards">Yards</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={calculateArea}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Calculate Area
          </Button>
          <Button
            onClick={calculateMissingSide}
            variant="outline"
            className="flex-1"
          >
            Find Missing Side
          </Button>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-secondary/50 rounded-lg text-center"
          >
            <p className="font-medium">Result</p>
            <p className="text-lg">{result}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
