from flask_wtf import FlaskForm  # Import FlaskForm from flask_wtf
from wtforms import StringField, TextAreaField, SubmitField, FormField, FieldList  # Import necessary fields from wtforms
from wtforms.validators import DataRequired  # Import the DataRequired validator

class SubsectionForm(FlaskForm):  # Define a form for subsections
    title = StringField('Subsection Title', validators=[DataRequired()])  # Title field for the subsection
    content = TextAreaField('Subsection Content', validators=[DataRequired()])  # Content field for the subsection

class SectionForm(FlaskForm):  # Define a form for sections
    title = StringField('Section Title', validators=[DataRequired()])  # Title field for the section
    content = TextAreaField('Section Content', validators=[DataRequired()])  # Content field for the section
    # FieldList to allow multiple subsections within a section
    subsections = FieldList(FormField(SubsectionForm), min_entries=1)

class ResearchForm(FlaskForm):  # Define the main form for the research article
    title = StringField('Title', validators=[DataRequired()])  # Title field for the article
    author = StringField('Author', validators=[DataRequired()])  # Author field for the article
    abstract = TextAreaField('Abstract', validators=[DataRequired()])  # Abstract field for the article
    # FieldList to allow multiple sections within the article
    sections = FieldList(FormField(SectionForm), min_entries=1)
    submit = SubmitField('Generate Article')  # Submit button for the form