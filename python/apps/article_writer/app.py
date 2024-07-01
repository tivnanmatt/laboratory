from flask import Flask, render_template, request
from forms import ResearchForm
from models import Article, Section, Subsection

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'

@app.route('/', methods=['GET', 'POST'])
def index():
    form = ResearchForm()
    article_content = ""
    format_type = 'html'
    
    if form.validate_on_submit():
        sections = []
        for section_form in form.sections.entries:
            subsections = [Subsection(title=sub.title.data, content=sub.content.data) for sub in section_form.subsections.entries]
            section = Section(title=section_form.title.data, content=section_form.content.data, subsections=subsections)
            sections.append(section)
        
        article = Article(
            title=form.title.data,
            author=form.author.data,
            abstract=form.abstract.data,
            sections=sections
        )
        
        format_type = request.form.get('format', 'html')
        if format_type == 'markdown':
            article_content = article.markdown()
        elif format_type == 'latex':
            article_content = article.latex()
        else:
            article_content = render_template('article.html', article=article)
    
    return render_template('index.html', form=form, article_content=article_content, format_type=format_type)

if __name__ == '__main__':
    app.run(debug=True)