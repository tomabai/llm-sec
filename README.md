# OWASP Top 10 LLM Vulnerabilities Interactive Guide

An interactive web application showcasing the OWASP Top 10 LLM Application Security Risks. Built with Next.js, Tailwind CSS, and shadcn/ui components.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.4-blue.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)

## Overview

This project provides an educational resource for understanding and mitigating the OWASP Top 10 LLM Application Security Risks. It's designed to help developers, security professionals, and organizations understand the unique security challenges when working with Large Language Models (LLMs).

## Features

- Interactive threat model diagram
- Detailed information about each vulnerability
- Demo pages for each vulnerability type
- Modern, responsive UI with accessibility features
- Code examples for implementing proper security controls
- Best practices for securing LLM applications
- **Dual execution modes**: Run labs with API or local in-browser models
- **Privacy-first option**: Process challenges entirely client-side with WebGPU

## LLM Configuration

This application supports two modes for running lab challenges:

### API Mode
Use OpenAI's API for cloud-based model inference:
- Requires an OpenAI API key
- Uses models like GPT-4o-mini, GPT-4o
- Fast and consistent performance
- Suitable for all labs

### Local Mode (NEW!)
Run models entirely in your browser using WebGPU:
- **No API key required** - completely free
- **Privacy-first** - data never leaves your device
- Powered by [@mlc-ai/web-llm](https://github.com/mlc-ai/web-llm)
- Requires modern browser (Chrome/Edge 113+, Firefox 115+)
- GPU required for good performance

#### Available Local Models:
- **Qwen 2.5 (0.5B)** - ~500MB - Fastest, great for demos
- **Gemma 2B** - ~1.5GB - Good balance of speed and capability
- **Phi-3 Mini** - ~1.8GB - Microsoft's efficient model
- **Llama 3.2 (3B)** - ~2GB - Meta's latest small model

Models are downloaded once and cached in your browser for future use.

#### System Requirements for Local Mode:
- Modern GPU with WebGPU support
- Minimum 4GB VRAM (8GB+ recommended)
- Chrome 113+, Edge 113+, or Firefox 115+

### How to Switch Modes:
1. Navigate to any lab page
2. Use the mode selector in the configuration panel
3. For Local Mode: Select a model and click "Download & Load Model"
4. For API Mode: Enter your OpenAI API key

You can switch between modes at any time during your session.

## Getting Started

### Prerequisites
- Node.js 18+ installed
- (Optional) OpenAI API key for API mode
- (Optional) Modern GPU for local mode

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TomAbai/llm-sec.git
   cd llm-sec
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### First Time Setup

**Option 1: API Mode (Recommended for beginners)**
1. Navigate to any lab page
2. Click on "API Mode" in the configuration panel
3. Enter your OpenAI API key
4. Start exploring vulnerabilities!

**Option 2: Local Mode (No API key needed)**
1. Navigate to any lab page
2. Click on "Local Mode" in the configuration panel
3. Select a model from the dropdown (Phi-3 Mini recommended for first try)
4. Click "Download & Load Model" and wait for download to complete
5. Start exploring vulnerabilities completely offline!

## Project Structure

- `/src/app` - Next.js app router pages
- `/src/components` - Reusable React components including mode selectors
- `/src/lib` - LLM service abstraction, web-llm engine wrapper
- `/src/types` - TypeScript type definitions
- `/public` - Static assets including the threat model diagram

## Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **LLM Integration**: OpenAI API, @mlc-ai/web-llm
- **WebGPU**: For local model execution
- **UI Components**: shadcn/ui, Lucide icons

## Contributing

Contributions are welcome! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest enhancements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- GitHub: [https://github.com/TomAbai/llm-sec](https://github.com/TomAbai/llm-sec)
- Report issues: [https://github.com/TomAbai/llm-sec/issues](https://github.com/TomAbai/llm-sec/issues)

## Acknowledgments

- OWASP for their research and documentation on LLM security risks
- MLC team for [@mlc-ai/web-llm](https://github.com/mlc-ai/web-llm) enabling in-browser LLM execution
- All contributors who have helped improve this project

## Troubleshooting

### Local Mode Issues

**"WebGPU not supported"**
- Ensure you're using Chrome 113+, Edge 113+, or Firefox 115+
- Check that your GPU supports WebGPU
- Try updating your graphics drivers

**Model download stuck or slow**
- Check your internet connection
- Try a smaller model first (Qwen 2.5 0.5B)
- Clear browser cache and retry

**Out of memory errors**
- Try a smaller model
- Close other browser tabs
- Switch to API mode if issues persist

**Model inference is slow**
- Ensure your GPU has sufficient VRAM (4GB+ recommended)
- Try a smaller model
- Consider using API mode for better performance

### API Mode Issues

**"API quota exceeded"**
- Check your OpenAI account billing
- Verify your API key is valid
- Check rate limits on your OpenAI account
