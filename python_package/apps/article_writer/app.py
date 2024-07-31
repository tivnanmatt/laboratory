from flask import Flask, render_template, request  # Import necessary modules from Flask
from forms import ResearchForm  # Import the ResearchForm from forms.py
from models import Article, Section, Subsection  # Import Article, Section, and Subsection classes from models.py

app = Flask(__name__)  # Create a Flask application instance
app.config['SECRET_KEY'] = 'your_secret_key'  # Set a secret key for secure form handling

@app.route('/', methods=['GET', 'POST'])  # Define the route for the index page, allowing both GET and POST methods
def index():
    form = ResearchForm()  # Instantiate the ResearchForm
    article_content = ""  # Initialize a variable to hold the article content
    format_type = 'html'  # Default format type is HTML

    if form.validate_on_submit():  # Check if the form is submitted and valid
        sections = []  # Initialize an empty list to hold sections
        for section_form in form.sections.entries:  # Loop through each section form entry
            # Create Subsection instances from form data
            subsections = [Subsection(title=sub.title.data, content=sub.content.data) for sub in section_form.subsections.entries]
            # Create a Section instance from form data
            section = Section(title=section_form.title.data, content=section_form.content.data, subsections=subsections)
            sections.append(section)  # Add the Section instance to the sections list

        # Create an Article instance using the form data and sections
        article = Article(
            title=form.title.data,
            author=form.author.data,
            abstract=form.abstract.data,
            sections=sections
        )

        # Determine the format type selected by the user
        format_type = request.form.get('format', 'html')
        if format_type == 'markdown':
            article_content = article.markdown()  # Generate the article content in Markdown format
        elif format_type == 'latex':
            article_content = article.latex()  # Generate the article content in LaTeX format
        else:
            article_content = render_template('article.html', article=article)  # Render the article content in HTML format

    return render_template('index.html', form=form, article_content=article_content, format_type=format_type)  # Render the index.html template

if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask application in debug mode