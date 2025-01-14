> [!IMPORTANT]
> This extension is specifically designed for IT teams utilizing the Autotask platform.

## Features

### AI Functions
- The extension integrates with OpenAI's GPT-4o mini.
- Summarize Ticket: This feature helps to generate concise summaries of ticket details, including action points and pending tasks, directly within the Autotask system.
- Grammar Check: This feature corrects spelling errors and basic grammatical mistakes in Autotask notes, ensuring clear and professional communication.
- Elaborate Ticket: This feature helps generate more detailed and clear descriptions of tickets.
- Find Solution: This feature uses AI to suggest potential solutions for ticket issues based on the provided information.
> [!WARNING]
> You will need your own OpenAI API key to use this feature. You can set this key in the extension menu.

### Autotask response templates with dynamic variables
- You can create custom email templates within Autotask using predefined variables for dynamic content.
- **List of available variables:**
  - `${loggedinUser}`: The name of the logged-in user.
  - `${ticketContactFirstname}`: The first name of the ticket contact.
  - `${ticketContactLastname}`: The last name of the ticket contact.
  - `${ticketPrimaryResource}`: The primary resource assigned to the ticket.
  - `${ticketLastActivityTime}`: The date and time of the last activity on the ticket.
  - `${ticketPriority}`: The priority level of the ticket.
  - `${ticketCurrentStatus}`: The current status of the ticket.
  - `${ticketNewStatus}`: The new status that has been set for the ticket.
  - `${currentTime}`: The current time.
  - `${currentDate}`: The current date.

### Password generator
The password generator is a tool designed to help you create secure and customizable passwords with the following features:

- **Adjustable Password Length:** Choose a password length between 4 and 64 characters using a slider for precise control over password complexity.

- **Character Inclusion Options:**
  - Lowercase Letters: Include lowercase alphabets (a-z).
  - Uppercase Letters: Include uppercase alphabets (A-Z).
  - Numbers: Include digits (0-9).
  - Symbols: Include special characters (e.g., !@#$%^&*).
  - You can select any combination of these character types to tailor your password.

- **Passphrase Generation:**
  - Opt to generate a passphrase consisting of three random words joined by hyphens (e.g., Apple-Dog-Sunshine).
  - Language Selection: Generates words in your selected language (currently supports English and Dutch).
  - Unique Words: Ensures no word is repeated in the same passphrase.
  - Capitalized Words: Each word starts with a capital letter for better readability and memorability.

- **Password History:**
  - Maintains a history of your last 20 generated passwords or passphrases.
  - Each entry includes the password and the timestamp of when it was generated.

### TOTP Hex and Base32 Generator
- A TOTP generator that provides both Hex and Base32 encoded keys.
- This feature is particularly useful for integrating with Duo Security and IT Glue, where such keys are often required.
  
### Automatically open URLs in incognito
- Automatically opens specified URLs (e.g., `portal.office.com`, `microsoft365.com`, `admin.microsoft.com`, `portal.azure.com`, `admin.google.com`) in incognito mode.
- Your own URLs can be setup
- A bypass filter can be enabled to prevent this automatic behavior, allowing the URLs to open in the normal browsing mode.

### Configuration Export and Import
- The extension allows you to export and import configuration settings, making it easy to transfer settings between different environments or users.

## Installation

1. [Download](https://github.com/El3ctr1cR/SupportTools-extension/archive/refs/heads/main.zip) the latest release.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory where this extension is located.
5. The extension is now installed and ready to use.

## License

This project is licensed under the GPL-3.0 license. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests with improvements or new features.

## Contact

For any questions or support, please open an issue on this repository.
