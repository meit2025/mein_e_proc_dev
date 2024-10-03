<?php
namespace App\Services;

use Exception;

class LdapAuthService {
    const LDAP_HOST = "10.8.10.11";
    const LDAP_DN = "DC=indonesiapower,DC=corp";
    const LDAP_USR = "etmcx";
    const LDAP_PASS = "3Tmcds08!dx!";

    function connect(){
        $ldapConnection = ldap_connect($this::LDAP_HOST);
        return $ldapConnection;
    }

    function login($ldapConnection, $username, $password){
        try {
            ldap_set_option($ldapConnection, LDAP_OPT_REFERRALS, 0);
            ldap_set_option($ldapConnection, LDAP_OPT_PROTOCOL_VERSION, 3);
            $ldapBind = @ldap_bind($ldapConnection, $username, $password);
            return $ldapBind;
        }catch(Exception $error) {
            return response() -> json(['message' => $error]);
        }
    }
}

?>
