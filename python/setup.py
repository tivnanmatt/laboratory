from setuptools import setup, find_packages

setup(
    name='laboratory',
    version='0.0',
    packages=find_packages(),
    install_requires=[
        # List your dependencies here
    ],
    entry_points={
        'console_scripts': [
            'laboratory=cli:main',
        ],
    },
)