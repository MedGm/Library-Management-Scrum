#!/bin/bash
# Script to compile the LaTeX report

# Check if pdflatex exists
if ! command -v pdflatex &> /dev/null
then
    echo "pdflatex could not be found. Please install a LaTeX distribution (e.g., TeX Live)."
    exit 1
fi

echo "Compiling Sprint 0 Report..."
pdflatex -interaction=nonstopmode main.tex
pdflatex -interaction=nonstopmode main.tex # Run twice for TOC/Refs

echo "Compilation complete. Check main.pdf"
