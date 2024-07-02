class Article:
    def __init__(self, title, author, abstract, sections):
        self.title = title  # Title of the article
        self.author = author  # Author of the article
        self.abstract = abstract  # Abstract of the article
        self.sections = sections  # List of sections in the article

    def latex(self):
        # Generate the LaTeX representation of the article
        latex_content = f"\\title{{{self.title}}}\n\\author{{{self.author}}}\n\\begin{{abstract}}\n{self.abstract}\n\\end{{abstract}}\n"
        for section in self.sections:  # Loop through each section
            latex_content += section.latex()  # Append the LaTeX representation of the section
        return latex_content  # Return the complete LaTeX content

    def markdown(self):
        # Generate the Markdown representation of the article
        markdown_content = f"# {self.title}\n\n**Author:** {self.author}\n\n**Abstract:**\n\n{self.abstract}\n"
        for section in self.sections:  # Loop through each section
            markdown_content += section.markdown()  # Append the Markdown representation of the section
        return markdown_content  # Return the complete Markdown content

class Section:
    def __init__(self, title, content, subsections):
        self.title = title  # Title of the section
        self.content = content  # Content of the section
        self.subsections = subsections  # List of subsections in the section

    def latex(self):
        # Generate the LaTeX representation of the section
        latex_content = f"\\section{{{self.title}}}\n{self.content}\n"
        for subsection in self.subsections:  # Loop through each subsection
            latex_content += subsection.latex()  # Append the LaTeX representation of the subsection
        return latex_content  # Return the complete LaTeX content of the section

    def markdown(self):
        # Generate the Markdown representation of the section
        markdown_content = f"## {self.title}\n\n{self.content}\n"
        for subsection in self.subsections:  # Loop through each subsection
            markdown_content += subsection.markdown()  # Append the Markdown representation of the subsection
        return markdown_content  # Return the complete Markdown content of the section

class Subsection:
    def __init__(self, title, content):
        self.title = title  # Title of the subsection
        self.content = content  # Content of the subsection

    def latex(self):
        # Generate the LaTeX representation of the subsection
        return f"\\subsection{{{self.title}}}\n{self.content}\n"

    def markdown(self):
        # Generate the Markdown representation of the subsection
        return f"### {self.title}\n\n{self.content}\n"