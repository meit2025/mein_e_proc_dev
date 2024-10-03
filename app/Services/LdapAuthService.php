<?php

namespace App\Services;

use Exception;

class LdapAuthService
{
    const LDAP_HOST = "17.10.19.13";
    const LDAP_DN = "DC=17.10.19.13,DC=corp";
    const LDAP_USR = "majapahit";
    const LDAP_PASS = "abcd.1234567890";

    function connect()
    {
        $ldapConnection = ldap_connect($this::LDAP_HOST);
        return $ldapConnection;
    }

    function login($ldapConnection, $username, $password)
    {
        try {
            ldap_set_option($ldapConnection, LDAP_OPT_REFERRALS, 0);
            ldap_set_option($ldapConnection, LDAP_OPT_PROTOCOL_VERSION, 3);
            $ldapBind = @ldap_bind($ldapConnection, $username, $password);
            return $ldapBind;
        } catch (Exception $error) {
            return response()->json(['message' => $error]);
        }
    }
}
