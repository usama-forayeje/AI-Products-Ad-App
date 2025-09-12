"use client";
import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  Sparkles,
  Zap,
  Edit3,
  Users,
  Clock,
  ArrowRight,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";
import { useAuthContext } from "./provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const AIProductGenerator = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { user } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Grid Background Component (Aceternity style)
  const GridBackground = ({ children, className = "" }) => {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px] dark:bg-blue-600"></div>
        </div>
        {children}
      </div>
    );
  };

  // Dot Background Component (Aceternity style)
  const DotBackground = ({ children, className = "" }) => {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] bg-[size:16px_16px]">
          <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-violet-400 opacity-20 blur-[100px] dark:bg-violet-600"></div>
        </div>
        {children}
      </div>
    );
  };

  // Animated Beam Effect
  const AnimatedBeams = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-pulse"></div>
        <div
          className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-violet-500/20 to-transparent animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>
    );
  };

  // Floating particles
  const FloatingParticles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 50
            ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                AI Ads Generator
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Contact
              </a>
            </div>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {!user ? (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 cursor-pointer dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
                  >
                    <Button>Sign In</Button>
                  </Link>

                  <Link
                    href="/app"
                    className="bg-black cursor-pointer dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                    <Image
                      src={user.photoURL || ""}
                      alt="profile"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full "
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <div className="py-4 space-y-4 border-t border-gray-200 dark:border-gray-800 mt-4">
              <a
                href="#"
                className="block text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#"
                className="block text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Pricing
              </a>
              <a
                href="#"
                className="block text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#"
                className="block text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Contact
              </a>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                {!user ? (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="w-full cursor-pointer text-left text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/app"
                      className="w-full bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200"
                    >
                      Get Started
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-300">
                      Profile
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
      {/* Hero Section with Grid Background */}
      <GridBackground className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <AnimatedBeams />
        <FloatingParticles />

        <div className="max-w-7xl mx-auto w-full">
          {/* Announcement Badge */}
          <div className="flex justify-center mb-8">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-blue-500 group-hover:rotate-180 transition-transform duration-500" />
              AI Product Concepts - Explore Now
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors duration-300">
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          </div>

          {/* Main Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              <span className="block">Generate Your</span>
              <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                Next Product Ads
              </span>
              <span className="block">With AI</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Effortlessly create innovative product ads and business concepts
              with our AI-powered platform. Innovation is now at your
              fingertips.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/app"
                className="group bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
              >
                Start Generating
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </Link>
              <Link
                href="/app"
                className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Watch Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Ideas Generated
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  5K+
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Happy Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  99%
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Success Rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  AI Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </GridBackground>
      {/* Features Section with Dot Background */}
      <DotBackground className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the power of AI-driven innovation with features
              designed for modern creators and entrepreneurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: "Endless Ideas",
                description:
                  "Get an endless number of product ideas quickly with AI.",
                color: "blue",
              },
              {
                icon: Edit3,
                title: "Easy Customization",
                description:
                  "Customize the generated ideas to fit your specific needs.",
                color: "violet",
              },
              {
                icon: Users,
                title: "User-Friendly Interface",
                description:
                  "Our intuitive interface makes it easy for anyone to use.",
                color: "green",
              },
              {
                icon: Clock,
                title: "Instant Results",
                description:
                  "Get effective and creative product ideas in seconds.",
                color: "orange",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                blue: "from-blue-500 to-blue-600",
                violet: "from-violet-500 to-violet-600",
                green: "from-green-500 to-green-600",
                orange: "from-orange-500 to-orange-600",
              };

              return (
                <div
                  key={index}
                  className="group bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:bg-white dark:hover:bg-black hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${
                      colorClasses[feature.color]
                    } rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-violet-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:gap-2 transition-all duration-300">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-0 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DotBackground>

      <footer className="py-8 border-t border-gray-200 dark:border-gray-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-4">
          <div className="flex space-x-4">
            <a
              href="https://github.com/usama-forayeje"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/usama-forayaje"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://x.com/forayaje"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            <p>
              © {new Date().getFullYear()} AI Ads Generator. All rights
              reserved.
            </p>
            <p className="mt-1">Built with ❤️ by Usama Forayaje</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AIProductGenerator;
