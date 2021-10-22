using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RainstormTech.Helpers
{
    internal static class SecurityHelper
    {
        const string LOWER_CASE = "abcdefghijklmnopqursuvwxyz";
        const string UPPER_CASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const string NUMBERS = "0123456789";
        const string SPECIALS = @"!@£$%^&*()#€";

        public static string GeneratePassword(bool useLowercase = true, bool useUppercase = true, bool useNumbers = true, bool useSpecial = true, int passwordSize = 12)
        {
            char[] _password = new char[passwordSize];
            string charSet = ""; // Initialise to blank
            Random _random = new Random();
            int counter;

            // Build up the character set to choose from
            if (useLowercase) charSet += LOWER_CASE;
            if (useUppercase) charSet += UPPER_CASE;
            if (useNumbers) charSet += NUMBERS;
            if (useSpecial) charSet += SPECIALS;

            for (counter = 0; counter < passwordSize; counter++)
            {
                // ensure we use at least 1 type of each subset of char
                if (counter == 0 && useLowercase)
                    _password[counter] = LOWER_CASE[_random.Next(LOWER_CASE.Length - 1)];
                else if (counter == 1 && useUppercase)
                    _password[counter] = UPPER_CASE[_random.Next(UPPER_CASE.Length - 1)];
                else if (counter == 2 && useNumbers)
                    _password[counter] = NUMBERS[_random.Next(NUMBERS.Length - 1)];
                else if (counter == 3 && useSpecial)
                    _password[counter] = SPECIALS[_random.Next(SPECIALS.Length - 1)];
                else
                    _password[counter] = charSet[_random.Next(charSet.Length - 1)];
            }

            return string.Join(null, _password);
        }
    }
}
