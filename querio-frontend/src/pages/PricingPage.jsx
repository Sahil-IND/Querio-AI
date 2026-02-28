import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Sparkles, Zap, Users, Building2 } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      icon: Sparkles,
      color: "blue",
      features: [
        "100 queries/month",
        "SQL intelligence",
        "Document RAG (5 docs)",
        "Basic support",
        "API access",
      ],
    },
    {
      name: "Pro",
      price: "$99",
      period: "/month",
      icon: Zap,
      color: "purple",
      popular: true,
      features: [
        "1,000 queries/month",
        "Advanced SQL",
        "Document RAG (50 docs)",
        "Priority support",
        "Hybrid queries",
        "Team collaboration",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      icon: Building2,
      color: "pink",
      features: [
        "Unlimited queries",
        "Custom integration",
        "Unlimited documents",
        "24/7 dedicated support",
        "SLA guarantee",
        "On-premise option",
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-200px)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Choose the plan that's right for your team
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -3 }}
            className={`glass-card relative border ${
              plan.popular
                ? "border-purple-500/40 hover:border-purple-500/60"
                : "border-white/5 hover:border-blue-500/20"
            } transition-all duration-300 hover:shadow-xl`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div
              className={`p-3 bg-${plan.color}-500/20 rounded-xl w-fit mb-4`}
            >
              <plan.icon className={`text-${plan.color}-400`} size={24} />
            </div>

            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-gray-500">{plan.period}</span>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + idx * 0.05 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <Check size={16} className="text-green-400" />
                  <span className="text-gray-300">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <Link
              to="/query"
              className={`block text-center w-full bg-gradient-to-r from-${plan.color}-600 to-${plan.color}-700 hover:from-${plan.color}-700 hover:to-${plan.color}-800 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105`}
            >
              Get Started
            </Link>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card text-center py-8"
      >
        <h3 className="text-xl font-semibold mb-4">Need a custom plan?</h3>
        <p className="text-gray-400 mb-4">
          Contact us for enterprise requirements and custom pricing
        </p>
        <Link
          to="/docs"
          className="text-blue-400 hover:text-blue-300 transition"
        >
          Contact Sales →
        </Link>
      </motion.div>
    </div>
  );
}
