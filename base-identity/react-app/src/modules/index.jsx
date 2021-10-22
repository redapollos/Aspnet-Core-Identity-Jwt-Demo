import Cms from './_Manage/Cms';
import Dashboard from './_Manage/Dashboard';
import Announcements from './_Manage/Announcements';
import EventLog from './_Manage/EventLog';
import Hooks from './_Manage/Hooks';
import Menus from './_Manage/Menus';
import Security from './_Manage/Security';
import Settings from './_Manage/Settings';
import SystemLists from './_Manage/SystemLists';
import SystemProps from './_Manage/SystemProps';
import Templates from './_Manage/Templates';
import MediaLibrary from './_Manage/MediaLibrary';
import Contacts from './_Manage/Contacts';

import AccountManagement from './AccountManagement';
import Leads from './Leads';

export default [    
    Cms, // content, tax/terms, content types
    Dashboard, // admin landing page
    MediaLibrary, // UI for media management
    Announcements, // accouncement management
    EventLog, // displays activity in the system
    Hooks, // allows for extending the system
    SystemLists, // manage generic lists
    Templates, // edit system email templates
    Settings, // manage system settings
    Menus, // update menus
    SystemProps, // extended props for users and content types
    Security, // manage users and roles
    Contacts, // viewing contacts

    AccountManagement, // allows user to manage their account
    Leads // display a list of people that a user is associated with
];