<?php

namespace App\Services;

use Exception;

class LdapAuthService
{
    const LDAP_HOST = "17.10.19.13";
    const LDAP_DN = "DC=17.10.19.13,DC=corp";
    const LDAP_USR = "majapahit";
    const LDAP_PASS = "abcd.1234567890";

    private $ldapHost;
    private $ldapDn;
    private $ldapUser;
    private $ldapPass;

    public function __construct()
    {
        // Get LDAP details from environment variables
        $this->ldapHost = env('LDAP_HOST');
        $this->ldapDn = env('LDAP_BASE_DN');
        $this->ldapUser = env('LDAP_USER');
        $this->ldapPass = env('LDAP_ADMIN_PASSWORD');
    }

    // function connect()
    // {
    //     try {
    //         $ldapConnection = ldap_connect($this::LDAP_HOST);
    //         return $ldapConnection;
    //     } catch (\Throwable $th) {
    //         throw new Exception($th->getMessage(), 1);
    //     }
    // }

    // function login($ldapConnection, $username, $password)
    // {
    //     try {
    //         ldap_set_option($ldapConnection, LDAP_OPT_REFERRALS, 0);
    //         ldap_set_option($ldapConnection, LDAP_OPT_PROTOCOL_VERSION, 3);
    //         $ldapBind = @ldap_bind($ldapConnection, $username, $password);
    //         return $ldapBind;
    //     } catch (Exception $error) {
    //         return response()->json(['message' => $error]);
    //     }
    // }

    // Method to establish connection
    public function connect()
    {
        try {
            $ldapConnection = ldap_connect($this->ldapHost);
            return $ldapConnection;
        } catch (Exception $e) {
            throw new Exception("Connection error: " . $e->getMessage());
        }
    }

    // Method to bind user credentials
    public function login($ldapConnection, $username, $password)
    {
        try {
            ldap_set_option($ldapConnection, LDAP_OPT_REFERRALS, 0);
            ldap_set_option($ldapConnection, LDAP_OPT_PROTOCOL_VERSION, 3);
            $ldapBind = @ldap_bind($ldapConnection, $username, $password);
            return $ldapBind;
        } catch (Exception $error) {
            throw new Exception("LDAP login failed: " . $error->getMessage());
        }
    }
}
