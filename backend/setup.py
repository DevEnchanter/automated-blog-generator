from setuptools import setup, find_packages

setup(
    name="blog-generator",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "python-dotenv",
        "google-generativeai",
        "firebase-admin",
    ],
) 