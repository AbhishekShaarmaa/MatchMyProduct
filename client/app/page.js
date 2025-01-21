"use client";

import { motion } from 'framer-motion';
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-between bg-gradient-to-br from-blue-500 to-indigo-600">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 bg-white/20 backdrop-blur-md shadow-lg">
        <h1 className="text-2xl font-bold text-white">Visual Image Matcher</h1>
        <Link href="/upload">
          <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Get Started
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-grow text-center px-6">
        <motion.h1
          className="text-5xl font-extrabold text-white leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Discover Visually <br /> Similar Products
        </motion.h1>
        <motion.p
          className="mt-6 text-lg text-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Upload an image and let our AI-powered engine find the best matches for you!
        </motion.p>
        <motion.div
          className="mt-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <Link href="/upload">
            <button className="px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all">
              Try It Now
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-200 bg-white/10">
        <p>© 2025 Visual Image Matcher. All rights reserved.</p>
      </footer>
    </div>
  );
}
