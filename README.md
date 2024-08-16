> [!IMPORTANT]
> This extension is specifically designed for IT teams utilizing the Autotask platform.

## Features

### AI Summarization of Tickets
- The extension integrates with OpenAI's GPT-4o mini to provide AI-driven summarization of Autotask tickets.
- This feature helps to generate concise summaries of ticket details, including action points and pending tasks, directly within the Autotask system.
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

### TOTP Hex and Base32 Generator
- A TOTP generator that provides both Hex and Base32 encoded keys.
- This feature is particularly useful for integrating with Duo Security and IT Glue, where such keys are often required.
  
### Office URLs in Incognito Mode
- Automatically opens specified Office URLs (e.g., `portal.office.com`, `microsoft365.com`, `admin.microsoft.com`, `portal.azure.com`) in incognito mode.
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
