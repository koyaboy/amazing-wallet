"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  Loader2,
  Shield,
  Banknote,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProcessingStage {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
}

interface XyleLoadingOverlayProps {
  isVisible: boolean;
  onComplete?: () => void;
  amount?: number;
  usdValue?: number;
  rate?: number;
  type?: "on-ramp" | "off-ramp";
}

const offRampStages: ProcessingStage[] = [
  {
    id: "validation",
    title: "Validating Transaction",
    description: "Verifying XYLE balance and conversion parameters",
    icon: <Shield className="w-5 h-5" />,
    duration: 2000,
  },
  {
    id: "conversion",
    title: "Processing Conversion",
    description: "Converting XYLE to USD at market rate",
    icon: <Zap className="w-5 h-5" />,
    duration: 3000,
  },
  {
    id: "settlement",
    title: "Initiating Settlement",
    description: "Preparing wire transfer to your bank account",
    icon: <Banknote className="w-5 h-5" />,
    duration: 2500,
  },
  {
    id: "complete",
    title: "Transaction Complete",
    description: "Funds will arrive in 1-2 business days",
    icon: <CheckCircle className="w-5 h-5" />,
    duration: 1000,
  },
];

const onRampStages: ProcessingStage[] = [
  {
    id: "validation",
    title: "Validating Payment",
    description: "Verifying payment details and processing deposit",
    icon: <Shield className="w-5 h-5" />,
    duration: 2000,
  },
  {
    id: "conversion",
    title: "Processing Conversion",
    description: "Converting USD to XYLE at market rate",
    icon: <Zap className="w-5 h-5" />,
    duration: 3000,
  },
  {
    id: "settlement",
    title: "Minting XYLE",
    description: "Creating XYLE tokens in your wallet",
    icon: <Banknote className="w-5 h-5" />,
    duration: 2500,
  },
  {
    id: "complete",
    title: "Transaction Complete",
    description: "XYLE tokens added to your wallet",
    icon: <CheckCircle className="w-5 h-5" />,
    duration: 1000,
  },
];

export default function XyleLoadingOverlay({
  isVisible,
  onComplete,
  amount = 1250,
  usdValue = 172500,
  rate = 138,
  type = "on-ramp",
}: XyleLoadingOverlayProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Reset state when overlay becomes visible or hidden
  useEffect(() => {
    if (isVisible) {
      // Reset state when becoming visible
      setCurrentStage(0);
      setProgress(0);
      setStageProgress(0);
      setIsComplete(false);
    } else {
      // Clean up any pending timers when hidden
      setCurrentStage(0);
    }
  }, [isVisible]);

  // Get the appropriate stages based on type
  const processingStages = type === "off-ramp" ? offRampStages : onRampStages;

  useEffect(() => {
    if (!isVisible) return;

    let stageTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    // Handle completion
    if (currentStage >= processingStages.length) {
      setIsComplete(true);
      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, 2000);
      return () => clearTimeout(completeTimer);
    }

    // Process current stage
    const stage = processingStages[currentStage];
    const intervalStep = 50; // Update every 50ms
    const progressIncrement = 100 / (stage.duration / intervalStep);

    const interval = setInterval(() => {
      setStageProgress((prev) => {
        const newProgress = prev + progressIncrement;
        if (newProgress >= 100) {
          clearInterval(interval);

          // Move to next stage after a short delay
          stageTimer = setTimeout(() => {
            const nextStage = currentStage + 1;
            setCurrentStage(nextStage);
            setStageProgress(0);

            // Update overall progress
            progressTimer = setTimeout(() => {
              setProgress((nextStage / processingStages.length) * 100);
            }, 50);
          }, 300);

          return 100;
        }
        return newProgress;
      });
    }, intervalStep);

    // Clean up all timers
    return () => {
      clearInterval(interval);
      clearTimeout(stageTimer);
      clearTimeout(progressTimer);
    };
  }, [currentStage, isVisible, onComplete]);

  const currentStageData =
    processingStages[currentStage] ||
    processingStages[processingStages.length - 1];

  // Update the conversion description with actual amounts
  const updatedStages = processingStages.map((stage) =>
    stage.id === "conversion"
      ? {
          ...stage,
          description: `Converting ${amount.toLocaleString()} XYLE to $${usdValue.toLocaleString()} USD at market rate`,
        }
      : stage
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 backdrop-blur-md bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <Card className="w-full max-w-lg bg-slate-800/95 border-slate-700 backdrop-blur-sm shadow-2xl">
              <div className="p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-3 mb-3"
                  >
                    <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">AW</span>
                    </div>
                    <h1 className="text-xl font-bold text-white">
                      AMAZING Wallet
                    </h1>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-400 text-sm"
                  >
                    Processing your XYLE{" "}
                    {type === "off-ramp" ? "off-ramp" : "on-ramp"} transaction
                  </motion.p>
                </div>

                {/* Transaction Summary */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-slate-700/50 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-slate-400 text-xs">
                        {type === "off-ramp" ? "Converting" : "Depositing"}
                      </p>
                      <p className="text-white text-lg font-semibold">
                        {type === "off-ramp"
                          ? `${amount.toLocaleString()} XYLE`
                          : `$${amount.toLocaleString()} USD`}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                    <div className="text-right">
                      <p className="text-slate-400 text-xs">Receiving</p>
                      <p className="text-green-400 text-lg font-semibold">
                        {type === "off-ramp"
                          ? `$${usdValue.toLocaleString()} USD`
                          : `${usdValue.toLocaleString()} XYLE`}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 text-xs">
                      Rate: 1 XYLE = ${rate.toFixed(2)} USD
                    </p>
                  </div>
                </motion.div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-xs">
                      Overall Progress
                    </span>
                    <span className="text-slate-400 text-xs">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2 bg-slate-700" />
                </div>

                {/* Current Stage */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="mb-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                        {isComplete ||
                        currentStage >= processingStages.length ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                            className="text-blue-400"
                          >
                            {currentStageData.icon}
                          </motion.div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">
                          {currentStageData.title}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {currentStageData.id === "conversion"
                            ? type === "off-ramp"
                              ? `Converting ${amount.toLocaleString()} XYLE to $${usdValue.toLocaleString()} USD at market rate`
                              : `Converting $${amount.toLocaleString()} USD to ${usdValue.toLocaleString()} XYLE at market rate`
                            : currentStageData.description}
                        </p>
                      </div>
                    </div>

                    {!isComplete && (
                      <div className="ml-13">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-400 text-xs">
                            Stage Progress
                          </span>
                          <span className="text-slate-400 text-xs">
                            {Math.round(stageProgress)}%
                          </span>
                        </div>
                        <Progress
                          value={stageProgress}
                          className="h-1 bg-slate-700"
                        />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Stage Timeline */}
                <div className="space-y-2">
                  {updatedStages.map((stage, index) => (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
                        index < currentStage
                          ? "bg-green-600/20 border border-green-600/30"
                          : index === currentStage
                          ? "bg-blue-600/20 border border-blue-600/30"
                          : "bg-slate-700/30 border border-slate-600/30"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          index < currentStage
                            ? "bg-green-600"
                            : index === currentStage
                            ? "bg-blue-600"
                            : "bg-slate-600"
                        }`}
                      >
                        {index < currentStage ? (
                          <CheckCircle className="w-3 h-3 text-white" />
                        ) : index === currentStage ? (
                          <Loader2 className="w-3 h-3 text-white animate-spin" />
                        ) : (
                          <span className="text-white text-xs font-bold">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-medium text-sm ${
                            index <= currentStage
                              ? "text-white"
                              : "text-slate-400"
                          }`}
                        >
                          {stage.title}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Security Notice */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-6 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-400 font-medium text-xs">
                      Secure Transaction
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Your transaction is protected by bank-grade encryption and
                    multi-signature security protocols.
                  </p>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
