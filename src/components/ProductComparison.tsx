import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Product {
  id: string;
  name: string;
  tagline: string;
  price: string;
  recommended?: boolean;
  features: Record<string, string | boolean>;
}

const products: Product[] = [
  {
    id: "v1",
    name: "Siccator Solaris V1",
    tagline: "Perfect for small-scale farmers",
    price: "Contact for pricing",
    features: {
      capacity: "25-50 kg",
      solarPanels: "150W",
      battery: "12V 50Ah",
      sensors: "Temperature & Humidity",
      aiOptimization: false,
      iotConnectivity: false,
      remoteMonitoring: false,
      mobileApp: false,
      warranty: "2 years",
      bestFor: "Small farms, Personal use",
    },
  },
  {
    id: "v2",
    name: "Siccator Solaris V2",
    tagline: "Smart drying with IoT connectivity",
    price: "Contact for pricing",
    recommended: true,
    features: {
      capacity: "50-100 kg",
      solarPanels: "300W",
      battery: "12V 100Ah Lithium",
      sensors: "Multi-sensor array (Temp, Humidity, VOC, Light)",
      aiOptimization: true,
      iotConnectivity: true,
      remoteMonitoring: true,
      mobileApp: true,
      warranty: "5 years",
      bestFor: "Commercial farms, Cooperatives",
    },
  },
  {
    id: "enterprise",
    name: "Siccator Enterprise",
    tagline: "Industrial-scale processing",
    price: "Custom quote",
    features: {
      capacity: "500+ kg",
      solarPanels: "1000W+",
      battery: "Battery bank system",
      sensors: "Full sensor network + Weather station",
      aiOptimization: true,
      iotConnectivity: true,
      remoteMonitoring: true,
      mobileApp: true,
      warranty: "7 years + Service contract",
      bestFor: "Processing plants, Large operations",
    },
  },
];

const featureLabels: Record<string, { label: string; tooltip: string }> = {
  capacity: { label: "Drying Capacity", tooltip: "Amount of produce per batch" },
  solarPanels: { label: "Solar Panels", tooltip: "Power generation capacity" },
  battery: { label: "Battery Storage", tooltip: "Energy storage system" },
  sensors: { label: "Sensor Array", tooltip: "Environmental monitoring capabilities" },
  aiOptimization: { label: "AI Optimization", tooltip: "Machine learning for optimal drying" },
  iotConnectivity: { label: "IoT Connectivity", tooltip: "4G/WiFi cloud connection" },
  remoteMonitoring: { label: "Remote Monitoring", tooltip: "Monitor from anywhere" },
  mobileApp: { label: "Mobile App", tooltip: "iOS and Android app included" },
  warranty: { label: "Warranty", tooltip: "Product warranty period" },
  bestFor: { label: "Best For", tooltip: "Recommended use case" },
};

const ProductComparison = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(["v1", "v2", "enterprise"]);

  const toggleProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      if (selectedProducts.length > 1) {
        setSelectedProducts(selectedProducts.filter((p) => p !== id));
      }
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const visibleProducts = products.filter((p) => selectedProducts.includes(p.id));

  const renderFeatureValue = (value: string | boolean) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-primary mx-auto" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground mx-auto" />
      );
    }
    return <span className="text-foreground">{value}</span>;
  };

  return (
    <div className="w-full">
      {/* Product Selection */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {products.map((product) => (
          <Button
            key={product.id}
            variant={selectedProducts.includes(product.id) ? "default" : "outline"}
            onClick={() => toggleProduct(product.id)}
            className={cn(
              selectedProducts.includes(product.id) && "gradient-primary text-primary-foreground"
            )}
          >
            {product.name}
          </Button>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Header */}
          <thead>
            <tr>
              <th className="p-4 text-left bg-muted rounded-tl-lg"></th>
              {visibleProducts.map((product, index) => (
                <th
                  key={product.id}
                  className={cn(
                    "p-4 text-center bg-muted min-w-[200px]",
                    index === visibleProducts.length - 1 && "rounded-tr-lg"
                  )}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    {product.recommended && (
                      <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        Recommended
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.tagline}</p>
                    <p className="text-lg font-semibold text-primary">{product.price}</p>
                  </motion.div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {Object.keys(featureLabels).map((featureKey, rowIndex) => (
              <motion.tr
                key={featureKey}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                className={cn(
                  "border-b border-border",
                  rowIndex % 2 === 0 && "bg-muted/30"
                )}
              >
                <td className="p-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-2 text-foreground font-medium">
                        {featureLabels[featureKey].label}
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        {featureLabels[featureKey].tooltip}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
                {visibleProducts.map((product) => (
                  <td key={product.id} className="p-4 text-center">
                    {renderFeatureValue(product.features[featureKey])}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">
          Need help choosing the right solution for your needs?
        </p>
        <Button className="gradient-primary text-primary-foreground">
          Request a Consultation
        </Button>
      </div>
    </div>
  );
};

export default ProductComparison;
