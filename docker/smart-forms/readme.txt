=== Smart Forms - when you need more than just a contact form ===
Contributors: EDGARROJAS
Tags: form, forms, contact form, custom form, form builder
Requires at least: 3.3
Tested up to: 6.5
Stable tag: 2.6.98
License: GPLv3 or later
Author URI: https://smartforms.rednao.com/
Plugin URI: https://smartforms.rednao.com/
License URI: http://www.gnu.org/licenses/gpl-3.0.html

Create calculators, quotes, registrations, order forms easily with the most advanced form builder.

== Description ==

= Smart Forms =
>Want to see a demo? [Click here](http://smartforms.rednao.com/demo/)

>Want to create a form with calculations? This is the best plugin for you [And Here Is Why](https://smartforms.rednao.com/calculators/)

https://www.youtube.com/watch?v=w8BZbO-8Dqk

So you want to create a beautiful form, the problem is, you are not a developer and of course you have no time to learn any of that?, well, if that is you (or your client) this is the plugin for you.

This plugin is focused in making really easy the process of creating your forms, with it you can add formulas to calculate totals (it doesn't matter if your totals require complex calculations) or show the fields that you need just when you need them.

Emailing is easy, you can even send different types of emails to different persons at the same time, again no coding needed at all since everything is configured in a friendly screen.

You do know programing or web development? That's fine!, even though it is not needed, because there is a friendly interface for everything, you can still use those skills to add custom css or javascript code into your form and tweak it as you want it.

If you want to learn more keep reading, there is a list of features bellow, or even better check out the video tutorials here: http://smartforms.rednao.com/tutorials. I hope you like it =).

**Features:**

*   **Responsive Forms**- The forms adjust automatically to available space, making them look great in a pc or any device.
*   **Shortcode Forms**- The forms can be easily added to any post or page using a shortcode or block.
*   **Forms Entry Screen**- Easily view responses you can also edit them.
*   **Export to pdf or csv**- Export the submitted information as pdf or csv.
*   **Customizable forms emails**- After a form is submitted, send notification email with any information, and in any format that you need.
*   **Conditional emails**- Configure a type of email to be send only when a condition is met
*   **Calculated forms fields**- Formulas fill fields automatically (up to three fields per formula in the free version)
*   **Custom forms fields**- The plugin currently supports these custom forms elements: name, phone, email, address, number, captcha (**free version support up to 8 fields per form**).
*   **File Uploader (pro)**- Allows you to upload files in a form; you can configure the form to accept only one file or multiple files.
*   **Conditional Logic**- Show and hide fields depending on values in other fields; allows you to have an all-in-one form all in one place, instead of in multiple pages; prevents forms from overwhelming users.
*   **Tons of icons to decorate your form**- Create awesome forms with more than 200 icons; more coming soon.
*   **Style editor**- Change the aspect of your form with the build-in style editor, or if you are a designer create your own css rules easily.
*   **JavaScript editor**_ Create your own JavaScript code and customize your form exactly as you want it.
*   **Forms Compatible with Smart donations**- - You can create paypal forms with this plugin, and also enjoy all the power of smart donations (https://wordpress.org/plugins/smart-donations/, a smart donation license is required).
*   **Multiple Step Forms(pro)**- Split your forms in section, making them easier to understand and submit.
== Installation ==
1. Upload smart forms to the `/wp-content/plugins/` directory
2. Activate the item named  'smart forms' in the 'Plugins' menu in WordPress
3. Go to Smart Forms /Add new and create a new form
4. To add the forms to a widget go to widgets and drag the smart forms widget
5. To add the forms to a post type [sform]formid[/sform] (example:[sform]1[/sform]), you can find the formid of your form on the form list

== Frequently Asked Questions ==
**How can i receive an email with the information of the form?**
You can configure this in the form builder. Go to the email configuration screen (in the forms after submit tab->edit email) and add the email that you want to receive the form information in the field "Send email to". For a video demostration pelase check the smart forms tutorials, specially this video: http://www.youtube.com/watch?v=kpRWqrYYPVY

**I get an error message when i try to "Send a test email"**
Your server should be able to send emails in order for this to work. Please check the configuration

**How can i send an email to the person that submitted the forms?**
Please check the smart forms tutorial: https://sfmanual.rednao.com/documentation/emailing/sending-an-email-to-the-person-who-filled-the-form

**How can i make my forms to support japanese characters**
This generally happens when your database doesn't support UTF-8 characters, so the form elements can not be stores properly. Please change your database to support UTF-8 characters and then try to submit a form to see if that worked.





**How can i style the elements of the forms**
1. Select the form element that you want to style
2. Click in the paint icon (to the right of the form element)
3. Style it and save the form

== Screenshots ==
1. Smart Forms Example 1
2. Smart Forms Example 2
3. Smart Forms Example 3
4. Smart Forms Example 4 (license required)
5. Smart Forms Example Template picker
6. Smart Forms Example Form designer
7. Smart Forms Example Email builder
8. Smart Forms Example Entries Screen
9. Smart Forms Example Survey


== Changelog ==
=  2.6.89 =
* Fixed issue with style tab
=  2.6.88 =
* Fixed issue with entries editor
=  2.6.87 =
* Fixed issue with newsletter message
=  2.6.85 =
* Fixed issue with save form settings
=  2.6.84 =
* Changed the support site
=  2.6.83 =
* Added support to WordPress 6.3
=  2.6.82 =
* Added aria required
=  2.6.81 =
* Update support url
=  2.6.76 =
* Fixed issue with php 8.1
=  2.6.74 =
* Fixed issue with input text displaying warning
=  2.6.73 =
* Fixed issue with email doctor
=  2.6.71 =
* Added allowed extension to the file upload field
=  2.6.70 =
* Fixed listed entries issue
=  2.6.69 =
* Tested for wordpress 5.9
=  2.6.66 =
* Added resend email function to the entries screen
=  2.6.65 =
* Added term of service and ip to the entries screen
=  2.6.64 =
* Fixed issue with input max width
=  2.6.63 =
* Added translatable text
=  2.6.62 =
* Making entries screen to show newest records first.
=  2.6.58 =
* Fixed issue related to nonces.
=  2.6.57 =
* Fixed issue with email designer losing new lines
=  2.6.56 =
* Fixed issue with captcha
=  2.6.51 =
* Fixed issue with date picker
=  2.6.48 =
* Added hook when the form list is loaded
=  2.6.47 =
* Fixed issue with text area field not showing correctly in email
* Fixing the position of the time pop up
=  2.6.45 =
* Fixed issue with clear action and auto save add on
* Improved image upload field type validation.
=  2.6.44 =
* Added formula support to the maximum and minimum settings of the number field
* Added an option of the button field to let it clear the form without submitting
* Added read only option to the number field and id option to the group panel
=  2.6.43 =
* Fixed issue with file upload on emails
=  2.6.42 =
* Hiding the label container when the label is empty
=  2.6.41 =
* Added a sequential id to every form
* Making the readonly fields editable in the entries screen
=  2.6.40 =
* Added before insert filter
=  2.6.39 =
* Fixed issue with decimals in a numeric field
=  2.6.33 =
* Fixed issue with tooltips
* Added a hook to the repeater field
=  2.6.32 =
* Added is empty validation
=  2.6.31 =
* Fixed issue with time picker
=  2.6.30 =
* Fixed issue with formula of date picker
=  2.6.29 =
* Fixed issues in entries screen, adding id to repeater field.
* Making the submit button keep spinning on redirection to avoid confusion
=  2.6.28 =
* Making checkbox and radio button color customizable
=  2.6.27 =
* Added spinner support to the multiple step form
=  2.6.26 =
* Fixed issue with currency field
= Smart Forms 2.6.25=
* Fixed issue with exporting checkboxes
= Smart Forms 2.6.24=
* Fixed issue with signature in entries screen
= Smart Forms 2.6.23=
* Added image support to the search field importer and fixed issue with signature field
= Smart Forms 2.6.22=
* https://smartforms.rednao.com/introducing-image-uploader/
= Smart Forms 2.6.16=
* Security fix.
= Smart Forms 2.6.13=
* Fixed issue with repeater field and formulas
= Smart Froms 2.5.14 =
* Added field container
* Fixed minor bugs
= Smart Froms 2.5.13 =
* Fixed bug with image field
* Added First Name, Last Name and Email fixed values.
= Smart Froms 2.5.12 =
*Fixed bug in form list screen
*Added transition animation to image field
= Smart Froms 2.5.11 =
Added image picker and image field
= Smart Froms 2.5.10 =
* Fixed issue with formulas
= Smart Froms 2.5.9 =
* Added style editor
* Added new rating field
* Added new horizontal line separator field
* Added rating demo
= Smart Froms 2.5.8 =
* Added decimal support to number field
* Added survey field
* Added survey template
= Smart Froms 2.5.7 =
* Added shortcode to the entries list
= Smart Froms 2.5.6 =
* Added link builder to email editor
* Fixed a problem with absolute links in the email editor
* Added fixed value 'User Name' to the formula builder
= Smart Froms 2.5.5 =
* Changed the email editor inorder to fix plugin conflicts and let me add additional features (like conditional text inside an email) in the future.

= Smart Froms 2.3.18 =
* Fixed bug with redirect url
= Smart Froms 2.3.17 =
* Fixed problem with numeric inputs
= Smart Froms 2.3.15 =
* Added after submit form action
* Added new custom action fields
= Smart Froms 2.3.15 =
* New feature, images in search boxes
= Smart Froms 2.3.14 =
*Fixed bug with multiplestep labels
= Smart Froms 2.3.13 =
*Added a way to configure the previous next and complete buttons of the multiple step forms
= Smart Froms 2.1.8 =
https://smartforms.rednao.com/2.1.8
= Smart Forms 2.5 =
* Update smart forms logic, making required but hidden fields in the forms not required.
= Smart Forms 2.3 =
* Updated smart forms's site.
= Smart Forms 2.0 =
* Added conditional formatting
= Smart Forms 1.5.23 =
Form builder improvement, added word count to text area
= Smart Forms 1.5.22 =
* Forms builder improvement, added css to fix issue with email editor.
= Smart Forms 1.5.21 =
* Forms Entries improvement, Increased the entries page size.
* Forms Entries improvement, added date in grid.
= Smart Forms 1.5.20 =
* Form builder improvements, Added instructions to formula screen to make it more understandable
= Smart Forms 1.5.16 =
* Fixed form builder bug in the email editor.
= Smart Forms 1.5.15 =
* Added fix in the form builder for tinymce.
= Smart Forms 1.5.13 =
* Improving form builder, adding before form submit ability to stop form submission.
= Smart Forms 1.5.12 =
* Fixing form element captcha to not focus when form loads.
* Form improvement, fixing "Send email to" in the form's email configuration.
= Smart Forms 1.5.11 =
* Fixed an issue when the forms when activating the plugin.
= Smart Forms 1.5 =
* Improved form builder, added file uploader.
* Fixing issue in form builder, color designer was not styiling the labels correctly when the form was loaded.
= Smart Forms 1.2.21 =
* Fixed form builder issue with clone button.
= Smart Forms 1.2.20 =
* Fixed scroll of the email editor scroll in the form builder.
* Added ability to delete rows in the entries screen (pro)
* Fixed issue of exporter not exporting everything when the data was paginated

* Added ability to delete entries(pro)
= Smart Forms 1.2.19 =
* Form builder modification. Making style editor a free feature, sorry this was supposed to be free from the beginning.
* Forms fix, fixed issue with the email to field, in the form builder under the email editor
= Smart Forms 1.2.18 =
* Forms improvement, created style designer
= Smart Forms 1.2.17 =
*Forms fix, fixed issue with calculated fields and check/radio boxes.
= Smart Forms 1.2.16 =
* Forms improvements in form builder, added the option to configure dynamic to emails.

= Smart Forms 1.2.15 =
* Forms improvements in form builder, adding a Default Contry property to the countries field.

= Smart Forms 1.2.13 =
* Forms improvements in form builder, added more validation to make it easier to configure an email
* Form field fix, email validation corrected.
* Added tutorial screen in smart forms to make it easier to find it.
= Smart Forms 1.2.11 =
* Emailer fix, fixing an issue with email not overwriting the from name
= Smart Forms 1.2.11 =
* Forms fix in form builder, fixed issue with form field
* Forms fix, fixed issue with title field

= Smart Forms 1.2.10 =
* Forms improvements in form builder, added minimun and maximun in the numeric field
* Forms improvements in form builder, added a configuration to define the invalid value text
= Smart Forms 1.2.9 =
* Forms Improvements in form builder, added a new property to the text area so you can disable it
= Smart Forms 1.2.8 =
* Forms Improvements disabled the checkbox edition in the form builder.
= Smart Forms 1.2.7 =
*Improved forms/Form builder, added validations to checkbox and dropdown
*Fixed forms/form builder, fixed issue of checkbox triming width
= Smart Forms 1.2.6 =
* Fixed forms form builder issue where imaes in the form radio button was not displayed
* Fixed forms editor, the formula screen was not displayed correctly
* Fixed forms form builder, the image of the formula was not getting displayed
= Smart Forms 1.2.5 =
* Fixed forms editor, Fixed issue with forms captcha
* Fixed forms editor, Fixed minor issue with forms submission
= Smart Forms 1.2.4 =
* Fixed forms generator, Fixed issue with redirecting not working with donations.
= Smart Forms 1.2.3 =
* Improving forms editor, Improved formula window

= Smart Forms 1.2.2 =
* Fixed forms editor, Fixed an issue with the form formulas
= Smart Forms 1.2.1 =
* Fixed forms editor, Added main class to widget
= Smart Forms 1.2 =
* Fixed forms editor, Fixed issue with form formulas
= Smart Forms 0.9 =
* Fixed forms editor, Added the ability to clone an existing form, so you don't have to do everything again if you want to create similar forms.
* Adding new feature, Added a wishlist/support page

= Smart Forms 1.1 =
* Fixed forms editor, Fixed issue with the text area form element
* Fixed forms editor, Fixed problem with the form form builder
* Improving forms editor, Added the option to select if you want to use horizontal radio or checkboxes

= Smart Forms 0.8.5 =
* Improving forms editor, Improving selection of options in the checkbox, radio buttons and select boxes

= Smart Forms 0.8 =
* Improving forms entry, Adding css export of submitted forms to entries screen
= Smart Forms 0.7 =
* Fixed forms editor, Fixing issue with the form submission
* Improving forms editor, Adding  the posibility to redirect to another page after the form was submitted
* Improving forms editor, Adding the posibility to customize the submission successfull message
* Fixed forms editor, Fixing a css issue with the form text boxes.
* Fixed forms editor, Fixed issues with forms
* Fixed forms editor, Fixed issue en the forms entries screen

= Smart forms 0.6 =
* Improving forms editor, Added new forms elements (email,phone, address, captcha,number)
* Fixed forms editor, Fixing issues with form email
* Fixed forms editor, Fixing issue with forms formulas
* Improving form, Added a wait cursor when the form is being submitted
= Smart forms 0.5.5 =
* Fixed forms editor, Fixed issue with form title element
* Improving form editor, Added Name form element
= Smart forms 0.5 =
* Fixed forms editor, Fixed issues with form width
* Added calculated fields to certain forms
* Fixed forms editor, Fixed issues in form builder
* Improving form editor, Added a new form element, date picker
= Smart forms 0.3 =
* Improving forms editor, Added advanced customization for forms email.
* Fixed forms editor, Fixed bugs in the form builder
* Fixed forms editor, Fixed bug in the form checkbox
* Fixed forms editor, Added the option to purchase the Smart Forms full version
= Smart forms 0.1 =
* First release of smart forms.
= Smart Forms 0.1.1 =
* Fixed forms editor, Fixing issues with the form entries screen
* Allow the grid of the form entries to expand based on entries
* Fixed forms editor, Fixing responsive forms

= Smart Forms 0.1.2 =
* Fixed form issue with required fields and form submission.
== Upgrade Notice ==

= Smart Forms 0.6 =
I fixed an issue with formulas in ie8, please after updating recreate your formulas (entering and exiting the formula screen) if you have any.

==Smart forms quick tutorials==
**Special thanks to**
Designmodo - https://www.iconfinder.com/icons/115789/trash_icon#size=16
**Installing Smart Forms**
1. Upload smart forms to the `/wp-content/plugins/` directory
2. Activate the item named  'smart forms' in the 'Plugins' menu in WordPress
3. Go to Smart Forms /Add new and create a new form
4. To add the form to a widget go to widgets and drag the smart form widget
5. To add the form to a post type [sform]formid[/sform] (example:[sform]1[/sform]), you can find the formid of your form on the form list

**Creating a new Forms**
1. Follow "Installing Smart Forms"
2. Click in smart forms
3. Click in add new
4. Drag the forms elements that you want to display 
3. (Optional) If you want to do an additional action after a form is submitted. Go to the forms after submit tab, you can:
		a)Send a notification email with the form information
		b)Show an alert with the text that you want. This alert is shown after the form was successfully saved.
		c)Redireect the user that submitted the form to another page.
4. Save the form.
5. After the form is saved you might want to add the form to a post (Follow "Add form to a post")  or add the form to a widget (Follow "Add form to a widget")
6. For a video tutorial please visit the smart forms tutorial screen

**Add the form to a post**
1. Follow "Installing Smart Forms"
2. Follow "Creating a new Form" to have your new form.
3. Go to a page or post
4. Click in the smart forms button
5. A pop up will show with the list of forms that you have created in Smart Forms. Select the form that you want.
6. Save the post.
7. When you visit the post the form will show up
8. For a video tutorial please visit the smart forms tutorial screen

**Add the form as a widget**
1. Follow "Installing Smart Forms"
2. Follow "Creating a new Form" to have your new form.
3. Go to the widget configuration
4. You will see an Smart Forms widget, drag it to wherever you want to display the form
5. The widget will contain the list of all the forms that you have created with Smart Forms.
6. Select the form that you want
7. The widget will display the form
8. For a video tutorial please visit the smart forms tutorial screen

**Configuring forms notification email**
1. Follow "Installing Smart Forms"
2. Click in smart forms
3. Click in add new
4. Drag the forms elements that you want
5. Go to edit email (in the forms after submit tab)
6. Configure the email as you want it. You can click in the field buttons to add form values
7. Put the emails that you want to be notified of a form submission in the  "Send email to" box, you can also define a form field.
8. Save the form
9. For a video tutorial please visit the smart forms tutorial screen