"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function AILearningLandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-black/70">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 flex items-center justify-center font-bold text-lg">
            AI
          </div>

          <h1 className="text-2xl font-bold tracking-wide">
            Learnify AI
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <a
            href="#features"
            className="hover:text-white transition-all"
          >
            Features
          </a>

          <a
            href="#courses"
            className="hover:text-white transition-all"
          >
            Courses
          </a>

          <a
            href="#pricing"
            className="hover:text-white transition-all"
          >
            Pricing
          </a>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <SignInButton mode="modal" forceRedirectUrl="/workspace">
            <button className="px-5 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-all">
              Login
            </button>
          </SignInButton>

          <SignUpButton mode="modal" forceRedirectUrl="/workspace">
            <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 text-black font-semibold hover:scale-105 transition-all duration-300">
              Get Started
            </button>
          </SignUpButton>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-8 py-24 lg:py-32 max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/40 bg-violet-500/10 text-violet-300 text-sm mb-6">
            🚀 AI Powered Personalized Learning
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Learn Anything
            <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent block">
              With AI Guidance
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-400 max-w-xl leading-relaxed">
            Build skills faster using AI-generated courses,
            interactive lessons, quizzes, smart roadmaps,
            and personalized learning paths tailored to
            your goals.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <SignUpButton mode="modal" forceRedirectUrl="/workspace">
              <button className="px-7 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 text-black font-bold hover:scale-105 transition-all duration-300 shadow-2xl shadow-violet-500/30">
                Start Learning Free
              </button>
            </SignUpButton>
          </div>

          <div className="mt-12 flex items-center gap-10 text-sm text-gray-400">
            <div>
              <h3 className="text-3xl font-bold text-white">
                50K+
              </h3>
              Students
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white">
                1K+
              </h3>
              AI Courses
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white">
                98%
              </h3>
              Satisfaction
            </div>
          </div>
        </div>

        {/* Hero Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-cyan-400/30 blur-3xl rounded-full"></div>

          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-400 text-sm">
                  Current Course
                </p>

                <h2 className="text-2xl font-bold">
                  AI Web Development
                </h2>
              </div>

              <div className="px-4 py-2 rounded-xl bg-green-500/20 text-green-300 text-sm">
                In Progress
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-black/40 rounded-2xl p-5 border border-white/5">
                <div className="flex justify-between mb-3 text-sm text-gray-400">
                  <span>Progress</span>
                  <span>72%</span>
                </div>

                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <h3 className="text-3xl font-bold">24</h3>

                  <p className="text-gray-400 mt-2">
                    Lessons Completed
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <h3 className="text-3xl font-bold">12h</h3>

                  <p className="text-gray-400 mt-2">
                    Learning Time
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-violet-500/20 to-cyan-400/20 rounded-2xl p-5 border border-violet-500/20">
                <p className="text-sm text-violet-200 mb-2">
                  AI Recommendation
                </p>

                <h3 className="text-xl font-semibold">
                  Next: Build Full Stack AI SaaS App
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

    

      {/* Features */}
      <section
        id="features"
        className="px-8 py-24 max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <p className="text-violet-400 font-semibold uppercase tracking-widest">
            Features
          </p>

          <h2 className="text-5xl font-bold mt-4">
            Smart Learning Experience
          </h2>

          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
            Everything you need to learn efficiently
            using advanced AI-powered tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "AI Generated Courses",
              desc: "Create personalized learning paths instantly using AI prompts.",
              icon: "🤖",
            },
            {
              title: "Interactive Quizzes",
              desc: "Practice with AI-generated quizzes and instant feedback.",
              icon: "🧠",
            },
            {
              title: "Video Learning",
              desc: "Watch lessons with AI summaries and smart notes.",
              icon: "🎥",
            },
            {
              title: "Progress Tracking",
              desc: "Track learning goals and daily achievements visually.",
              icon: "📊",
            },
            {
              title: "AI Mentor",
              desc: "Get instant explanations and coding help anytime.",
              icon: "💬",
            },
            {
              title: "Certificates",
              desc: "Earn shareable certificates after course completion.",
              icon: "🏆",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:border-violet-500/30"
            >
              <div className="text-5xl mb-5">
                {item.icon}
              </div>

              <h3 className="text-2xl font-bold mb-4">
                {item.title}
              </h3>

              <p className="text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section
        className="px-8 py-24 max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <p className="text-cyan-400 font-semibold uppercase tracking-widest">
            Courses
          </p>

          <h2 className="text-5xl font-bold mt-4">
            Popular AI Courses
          </h2>

          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
            Explore trending AI-powered learning paths.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "AI Web Development",
              level: "Beginner",
            },
            {
              title: "Full Stack AI SaaS",
              level: "Intermediate",
            },
            {
              title: "Machine Learning Basics",
              level: "Advanced",
            },
          ].map((course, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold mb-3">
                {course.title}
              </h3>

              <p className="text-gray-400 mb-6">
                Level: {course.level}
              </p>

              <SignUpButton
                mode="modal"
                forceRedirectUrl="/workspace"
              >
                <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 text-black font-semibold">
                  Start Course
                </button>
              </SignUpButton>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 pb-24 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-r from-violet-600/20 to-cyan-500/20 p-12 lg:p-20 text-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              Start Your AI Learning Journey Today
            </h2>

            <p className="mt-6 text-gray-300 text-lg max-w-2xl mx-auto">
              Join thousands of students building
              future-ready skills with AI.
            </p>

            <SignUpButton mode="modal" forceRedirectUrl="/workspace">
              <button id="courses" className="mt-10 px-8 py-4 rounded-2xl bg-white text-black font-bold hover:scale-105 transition-all duration-300">
                Explore Courses
              </button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* Pricing */}
<section
  id="pricing"
  className="px-8 py-24 max-w-7xl mx-auto"
>
  <div className="text-center mb-16">
    <p className="text-violet-400 font-semibold uppercase tracking-widest">
      Pricing
    </p>

    <h2 className="text-5xl font-bold mt-4">
      Choose Your Plan
    </h2>

    <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
      Flexible plans designed for students,
      developers, and AI enthusiasts.
    </p>
  </div>

  <div className="grid lg:grid-cols-3 gap-8">
    
    {/* Free Plan */}
    <div className="relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl hover:border-violet-500/30 transition-all duration-300">
      <div className="p-8">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-bold">
            Free
          </h3>

          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm">
            Active
          </span>
        </div>

        <div className="mt-10">
          <h2 className="text-6xl font-black">
            $0
          </h2>

          <p className="text-gray-400 mt-3">
            Always free
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 p-8 space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-green-400">✓</span>
          <p>3 AI Course Generations</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-green-400">✓</span>
          <p>Basic Learning Dashboard</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-green-400">✓</span>
          <p>Community Support</p>
        </div>

        <button className="w-full mt-8 py-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all">
          Current Plan
        </button>
      </div>
    </div>

    {/* Starter Plan */}
    <div className="relative bg-gradient-to-b from-violet-500/10 to-cyan-500/10 border border-violet-500/30 rounded-3xl overflow-hidden backdrop-blur-xl scale-105 shadow-2xl shadow-violet-500/10">
      
      <div className="absolute top-4 right-4 px-4 py-1 rounded-full bg-violet-500 text-white text-sm font-semibold">
        Popular
      </div>

      <div className="p-8">
        <h3 className="text-3xl font-bold">
          Starter
        </h3>

        <p className="text-gray-400 mt-3">
          Create AI Courses and learn faster
        </p>

        <div className="mt-10 flex items-end gap-2">
          <h2 className="text-6xl font-black">
            $7.99
          </h2>

          <span className="text-gray-400 mb-2">
            /month
          </span>
        </div>
      </div>

      <div className="border-t border-white/10 p-8 space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400">✓</span>
          <p>Unlimited AI Course Generation</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-cyan-400">✓</span>
          <p>AI Banner Images</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-cyan-400">✓</span>
          <p>Interactive Quizzes</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-cyan-400">✓</span>
          <p>Email Support</p>
        </div>

        <SignUpButton
          mode="modal"
          forceRedirectUrl="/workspace"
        >
          <button className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 text-black font-bold hover:scale-[1.02] transition-all duration-300">
            Subscribe
          </button>
        </SignUpButton>
      </div>
    </div>

    {/* Premium Plan */}
    <div className="relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl hover:border-cyan-500/30 transition-all duration-300">
      <div className="p-8">
        <h3 className="text-3xl font-bold">
          Premium
        </h3>

        <p className="text-gray-400 mt-3">
          Advanced AI learning ecosystem
        </p>

        <div className="mt-10 flex items-end gap-2">
          <h2 className="text-6xl font-black">
            $19
          </h2>

          <span className="text-gray-400 mb-2">
            /month
          </span>
        </div>
      </div>

      <div className="border-t border-white/10 p-8 space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-violet-400">✓</span>
          <p>Everything in Starter</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-violet-400">✓</span>
          <p>AI Mentor Assistant</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-violet-400">✓</span>
          <p>Premium Certificates</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-violet-400">✓</span>
          <p>Priority Support</p>
        </div>

        <SignUpButton
          mode="modal"
          forceRedirectUrl="/workspace"
        >
          <button className="w-full mt-8 py-4 rounded-2xl bg-white text-black font-bold hover:scale-[1.02] transition-all duration-300">
            Subscribe
          </button>
        </SignUpButton>
      </div>
    </div>
  </div>
</section>

    </div>
  );
}