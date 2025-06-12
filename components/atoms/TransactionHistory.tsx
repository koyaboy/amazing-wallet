import { PaginatedTransactionResponse } from "@mysten/sui/client";
import React from "react";
import { Button } from "../ui/button";
import { ExternalLink, FileText } from "lucide-react";

const TransactionHistory = ({
  transactions,
  isTransactionLoading,
}: {
  transactions: PaginatedTransactionResponse | null;
  isTransactionLoading: boolean;
}) => {
  if (isTransactionLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin bg-white rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-2 text-sm text-white">
        <thead>
          <tr className="text-gray-400 uppercase text-xs">
            <th className="py-2 text-left">Date</th>
            <th className="py-2 text-left">Type</th>
            <th className="py-2 text-left">Amount</th>
            <th className="py-2 text-left">Status</th>
            <th className="py-2 text-left">Details</th>
          </tr>
        </thead>
        <tbody>
          {transactions &&
            transactions?.data.map((transaction, index) => {
              if (index < 4)
                return (
                  <tr
                    key={index}
                    className="bg-[#1a1f2c] hover:bg-[#222835] transition-colors duration-150 rounded-md"
                  >
                    <td className="py-3 px-4 rounded-l-md">
                      {" "}
                      {new Date(
                        Number(transaction.timestampMs) * 1000
                      ).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs rounded ${"bg-green-900/30 text-green-400"}`}
                      >
                        {transaction.transaction?.data.transaction.kind}
                      </span>
                    </td>
                    {/* <td className="py-3 px-4">{transaction.amount}</td> */}
                    <td className="py-3 px-4 text-gray-400">
                      {/* {transaction.status} */}
                    </td>
                    <td className="py-3 px-4 rounded-r-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </td>
                  </tr>
                );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
