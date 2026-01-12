package com.kd.eventmanagement.backend.common.util;

import java.security.SecureRandom;

public class CodeGenerator {
    private static final String ALPHANUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RND = new SecureRandom();

    public static String eventCode() {
        return "EVT" + random(7);
    }

    public static String ticketNo(long seq) {
        return String.format("EVT-%06d", seq);
    }

    private static String random(int len) {
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(ALPHANUM.charAt(RND.nextInt(ALPHANUM.length())));
        }
        return sb.toString();
    }
}
