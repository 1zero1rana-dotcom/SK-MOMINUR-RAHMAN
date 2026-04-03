import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import { HSC_ICT_COURSES } from "../constants";
import { Smartphone, CheckCircle2, AlertCircle, ArrowRight, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = HSC_ICT_COURSES.find((c) => c.id === id);
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const bkashNumber = "01700000000"; // Placeholder

  const handleCopy = () => {
    navigator.clipboard.writeText(bkashNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call to save payment record
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (!course) return <div className="py-24 text-center">Course not found</div>;

  if (isSuccess) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-[40px] bg-white p-10 text-center shadow-2xl shadow-indigo-100 ring-1 ring-gray-100"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-black text-gray-900">Payment Submitted!</h2>
          <p className="mt-4 text-gray-600">
            Your payment for <strong>{course.title}</strong> is being verified. 
            This usually takes 1-6 hours. We'll notify you once it's approved.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
          >
            Go to Dashboard
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black tracking-tight text-gray-900">Manual Payment</h1>
          <p className="mt-4 text-lg text-gray-600">Follow the steps below to enroll in {course.title}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Step 1: Payment Info */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Step 1: Send Money</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Send <strong>৳{course.price}</strong> to the bKash Personal number below:</p>
                <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-200">
                  <span className="text-lg font-black text-gray-900">{bkashNumber}</span>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-yellow-50 p-4 text-xs text-yellow-800">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p>Please use "Send Money" option. Do not "Cash Out" or "Payment".</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-indigo-900 p-8 text-white shadow-xl">
              <h3 className="mb-4 text-xl font-bold">Course Summary</h3>
              <div className="space-y-3 text-sm text-indigo-200">
                <div className="flex justify-between">
                  <span>Course Price:</span>
                  <span className="font-bold text-white">৳2,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span className="font-bold text-green-400">-৳1,000</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-black text-white">
                  <span>Total Payable:</span>
                  <span>৳{course.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Form */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Step 2: Verify Payment</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700">bKash Transaction ID (TrxID)</label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="mt-2 block w-full rounded-2xl border-0 bg-gray-50 py-4 px-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  placeholder="e.g. 8N7A6D5C4B"
                />
                <p className="mt-2 text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                  You can find this in the bKash confirmation SMS.
                </p>
              </div>

              <div className="space-y-4 rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" required className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                  <label className="text-xs font-medium text-gray-700">I have sent the exact amount to the given number.</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" required className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                  <label className="text-xs font-medium text-gray-700">I understand that verification may take up to 6 hours.</label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Verification"}
                {!isSubmitting && <ArrowRight className="h-5 w-5" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
