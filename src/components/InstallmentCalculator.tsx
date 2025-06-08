
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InstallmentCalculatorProps {
  price: number;
}

interface InstallmentOption {
  months: number;
  interestRate: number;
}

const InstallmentCalculator: React.FC<InstallmentCalculatorProps> = ({ price }) => {
  const [selectedOption, setSelectedOption] = useState<string>("3");

  const installmentOptions: InstallmentOption[] = [
    { months: 3, interestRate: 15 },
    { months: 6, interestRate: 25 },
    { months: 12, interestRate: 40 },
  ];

  const calculateInstallment = (months: number, interestRate: number) => {
    const totalAmount = price * (1 + interestRate / 100);
    return totalAmount / months;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Pago en cuotas</h3>
        
        <Tabs defaultValue="3" value={selectedOption} onValueChange={setSelectedOption}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="3">3 cuotas</TabsTrigger>
            <TabsTrigger value="6">6 cuotas</TabsTrigger>
            <TabsTrigger value="12">12 cuotas</TabsTrigger>
          </TabsList>
          
          {installmentOptions.map((option) => (
            <TabsContent key={option.months} value={option.months.toString()} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Precio contado:</span>
                <span className="font-medium">${price.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Interés ({option.interestRate}%):</span>
                <span className="font-medium">${(price * option.interestRate / 100).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Precio final:</span>
                <span className="font-medium">${(price * (1 + option.interestRate / 100)).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between pt-2 border-t mt-2">
                <span className="font-semibold">Cuota mensual:</span>
                <span className="font-semibold text-primary">
                  ${calculateInstallment(option.months, option.interestRate).toFixed(2)}
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground mt-2">
                *Los valores son referenciales. Consulta las promociones vigentes.
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InstallmentCalculator;
