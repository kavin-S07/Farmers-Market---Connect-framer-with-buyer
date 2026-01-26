package com.example.farm_marketplace.service;

import com.example.farm_marketplace.dto.UserResponse;
import com.example.farm_marketplace.entity.User;
import com.example.farm_marketplace.exception.ResourceNotFoundException;
import com.example.farm_marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;

    /**
     * Find user by email
     */
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    /**
     * Find user by ID
     */
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    /**
     * Get current user profile by email
     */
    public UserResponse getUserProfile(String email) {
        User user = findByEmail(email);
        return mapToResponse(user);
    }

    /**
     * Get user by ID (for viewing other users like farmers/buyers)
     * This method was missing!
     */
    public UserResponse getUserById(Long id) {
        User user = findById(id);
        return mapToResponse(user);
    }

    /**
     * Update current user profile
     */
    @Transactional
    public UserResponse updateUserProfile(String email, UserResponse updateRequest) {
        User user = findByEmail(email);

        // Update only non-null fields
        if (updateRequest.getName() != null && !updateRequest.getName().isBlank()) {
            user.setName(updateRequest.getName());
        }
        if (updateRequest.getAddress() != null) {
            user.setAddress(updateRequest.getAddress());
        }
        if (updateRequest.getState() != null) {
            user.setState(updateRequest.getState());
        }
        if (updateRequest.getDistrict() != null) {
            user.setDistrict(updateRequest.getDistrict());
        }
        if (updateRequest.getPhone() != null) {
            user.setPhone(updateRequest.getPhone());
        }

        user = userRepository.save(user);
        return mapToResponse(user);
    }

    /**
     * Map User entity to UserResponse DTO
     */
    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .address(user.getAddress())
                .state(user.getState())
                .district(user.getDistrict())
                .phone(user.getPhone())
                .build();
    }
}