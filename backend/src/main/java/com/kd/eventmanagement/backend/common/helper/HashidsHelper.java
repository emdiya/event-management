package com.kd.eventmanagement.backend.common.helper;

import com.kd.eventmanagement.backend.config.HashIdProperties;
import lombok.extern.slf4j.Slf4j;
import org.hashids.Hashids;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Helper class for encoding/decoding UUIDs and Longs to/from hashids
 * Provides obfuscation for database IDs to prevent enumeration attacks
 */
@Slf4j
@Component
public class HashidsHelper {

    private final Hashids hashids;

    public HashidsHelper(HashIdProperties props) {
        this.hashids = new Hashids(props.getSalt(), props.getMinLength());
        log.info("HashidsHelper initialized with minLength: {}", props.getMinLength());
    }

    /**
     * Encode Long ID to hashid string
     */
    public String encode(Long id) {
        if (id == null) {
            return null;
        }
        
        try {
            return hashids.encode(id);
        } catch (Exception e) {
            log.error("Failed to encode Long ID: {}", id, e);
            return null;
        }
    }

    /**
     * Decode hashid string to Long ID
     */
    public Long decodeLong(String hashid) {
        if (hashid == null || hashid.isEmpty()) {
            return null;
        }
        
        try {
            long[] decoded = hashids.decode(hashid);
            return decoded.length > 0 ? decoded[0] : null;
        } catch (Exception e) {
            log.error("Failed to decode hashid to Long: {}", hashid, e);
            return null;
        }
    }

    /**
     * Encode UUID to hashid string
     */
    public String encode(UUID uuid) {
        if (uuid == null) {
            return null;
        }
        
        try {
            // Convert UUID to bytes and then to unsigned longs
            long mostSigBits = uuid.getMostSignificantBits();
            long leastSigBits = uuid.getLeastSignificantBits();
            
            // Convert to unsigned representation by splitting into 4 positive integers
            // This avoids negative number issues with Hashids
            long[] numbers = new long[4];
            numbers[0] = (mostSigBits >>> 32) & 0xFFFFFFFFL;  // Upper 32 bits
            numbers[1] = mostSigBits & 0xFFFFFFFFL;            // Lower 32 bits
            numbers[2] = (leastSigBits >>> 32) & 0xFFFFFFFFL;  // Upper 32 bits
            numbers[3] = leastSigBits & 0xFFFFFFFFL;           // Lower 32 bits
            
            return hashids.encode(numbers);
        } catch (Exception e) {
            log.error("Failed to encode UUID: {}", uuid, e);
            return null;
        }
    }

    /**
     * Decode hashid string to UUID
     */
    public UUID decode(String hashid) {
        if (hashid == null || hashid.isEmpty()) {
            return null;
        }
        
        try {
            long[] decoded = hashids.decode(hashid);
            
            if (decoded.length != 4) {
                log.warn("Invalid hashid format: expected 4 numbers, got {}", decoded.length);
                return null;
            }
            
            // Reconstruct the two long values from 4 unsigned integers
            long mostSigBits = (decoded[0] << 32) | decoded[1];
            long leastSigBits = (decoded[2] << 32) | decoded[3];
            
            return new UUID(mostSigBits, leastSigBits);
        } catch (Exception e) {
            log.error("Failed to decode hashid: {}", hashid, e);
            return null;
        }
    }

    /**
     * Validate if a string is a valid hashid
     */
    public boolean isValid(String hashid) {
        if (hashid == null || hashid.isEmpty()) {
            return false;
        }
        
        try {
            long[] decoded = hashids.decode(hashid);
            return decoded.length >= 1;
        } catch (Exception e) {
            return false;
        }
    }
}
