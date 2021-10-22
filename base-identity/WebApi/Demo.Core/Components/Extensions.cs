using AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using RainstormTech.Components;
using static RainstormTech.Data.Components.Enums;
using Markdig;

namespace RainstormTech.Components
{
    public static class Extensions
    {

        #region Simple

        public static Guid ToGuid(this string s)
        {
            if (string.IsNullOrEmpty(s))
                return Guid.Empty;

            if (Guid.TryParse(s, out Guid g))
                return g;
            return Guid.Empty;
        }

        public static int ToInt(this string s)
        {
            if (string.IsNullOrEmpty(s))
                return -1;

            if (Int32.TryParse(s, out int i))
                return i;
            return -1;
        }

        public static bool ToBool(this string s)
        {
            if (string.IsNullOrEmpty(s))
                return false;

            if (bool.TryParse(s, out bool i))
                return i;
            return false;
        }
        #endregion

        #region Structured
        public static string SwapDomain(this string orig, string d)
        {
            if (string.IsNullOrEmpty(orig))
                return d;

            // remove existing domain
            if (orig.StartsWith("//") || orig.StartsWith("http"))
            {
                orig = orig.Replace("//", "");
                orig = orig.Substring(orig.IndexOf("/"));
            }

            return $"{d}{orig}";
        }


        public static string ToGravatar(this string input)
        {
            if (string.IsNullOrEmpty(input))
            {
                return string.Empty;
            }

            input = input.Trim().ToLower();

            // step 1, calculate MD5 hash from input
            MD5 md5 = System.Security.Cryptography.MD5.Create();
            byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
            byte[] hash = md5.ComputeHash(inputBytes);

            // step 2, convert byte array to hex string
            var sb = new StringBuilder();

            for (var i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("X2"));
            }

            return sb.ToString().ToLower();
        }

        public static string ToPhone(this string str)
        {
            if (string.IsNullOrEmpty(str))
                return string.Empty;

            // strip to just numbers
            return Regex.Replace(str, "[^0-9]", "");            
        }

        public static string ToDomain(this string url)
        {
            if (string.IsNullOrEmpty(url))
                return string.Empty;

            url = url.Replace("http://", "").Replace("https://", "").Replace("www.", "");

            return url.Split('/')[0];
        }

        public static string ToWebsite(this string url)
        {
            if (string.IsNullOrEmpty(url))
                return string.Empty;

            // check both full and relative links
            if (!url.StartsWith("http") && !url.StartsWith("/"))
                url = $"http://{url}";

            return url;
        }

        #endregion

    }
}
