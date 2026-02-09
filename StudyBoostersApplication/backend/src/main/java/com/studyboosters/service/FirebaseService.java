package com.studyboosters.service;

import com.google.firebase.database.*;
import com.studyboosters.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class FirebaseService {

    private final FirebaseDatabase firebaseDatabase;
    private static final String ROOT_PATH = "study_boosters";

    /**
     * Get a list of items from Firebase
     */
    public <T> List<T> getList(String path, Class<T> clazz) throws ExecutionException, InterruptedException {
        CompletableFuture<List<T>> future = new CompletableFuture<>();
        DatabaseReference ref = firebaseDatabase.getReference(ROOT_PATH + "/" + path);

        ref.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                List<T> items = new ArrayList<>();
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    T item = snapshot.getValue(clazz);
                    // Set the ID from the key
                    try {
                        item.getClass().getMethod("setId", String.class).invoke(item, snapshot.getKey());
                    } catch (Exception e) {
                        System.err.println("Could not set ID: " + e.getMessage());
                    }
                    items.add(item);
                }
                future.complete(items);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                future.completeExceptionally(new RuntimeException("Firebase error: " + databaseError.getMessage()));
            }
        });

        return future.get();
    }

    /**
     * Get a single item from Firebase by ID
     */
    public <T> T getById(String path, String id, Class<T> clazz) throws ExecutionException, InterruptedException {
        CompletableFuture<T> future = new CompletableFuture<>();
        DatabaseReference ref = firebaseDatabase.getReference(ROOT_PATH + "/" + path + "/" + id);

        ref.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                if (dataSnapshot.exists()) {
                    T item = dataSnapshot.getValue(clazz);
                    try {
                        item.getClass().getMethod("setId", String.class).invoke(item, dataSnapshot.getKey());
                    } catch (Exception e) {
                        System.err.println("Could not set ID: " + e.getMessage());
                    }
                    future.complete(item);
                } else {
                    future.completeExceptionally(new ResourceNotFoundException("Item not found with ID: " + id));
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                future.completeExceptionally(new RuntimeException("Firebase error: " + databaseError.getMessage()));
            }
        });

        return future.get();
    }

    /**
     * Get a single value (for settings)
     */
    public <T> T getValue(String path, Class<T> clazz) throws ExecutionException, InterruptedException {
        CompletableFuture<T> future = new CompletableFuture<>();
        DatabaseReference ref = firebaseDatabase.getReference(ROOT_PATH + "/" + path);

        ref.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                if (dataSnapshot.exists()) {
                    T value = dataSnapshot.getValue(clazz);
                    future.complete(value);
                } else {
                    future.complete(null);
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                future.completeExceptionally(new RuntimeException("Firebase error: " + databaseError.getMessage()));
            }
        });

        return future.get();
    }

    /**
     * Push a new item to Firebase (generates new key)
     */
    public <T> String push(String path, T data) throws ExecutionException, InterruptedException {
        CompletableFuture<String> future = new CompletableFuture<>();
        DatabaseReference ref = firebaseDatabase.getReference(ROOT_PATH + "/" + path);
        DatabaseReference newRef = ref.push();

        newRef.setValue(data, (databaseError, databaseReference) -> {
            if (databaseError != null) {
                future.completeExceptionally(new RuntimeException("Firebase error: " + databaseError.getMessage()));
            } else {
                future.complete(newRef.getKey());
            }
        });

        return future.get();
    }

    /**
     * Set a value at a specific path
     */
    public <T> void setValue(String path, T data) throws ExecutionException, InterruptedException {
        CompletableFuture<Void> future = new CompletableFuture<>();
        DatabaseReference ref = firebaseDatabase.getReference(ROOT_PATH + "/" + path);

        ref.setValue(data, (databaseError, databaseReference) -> {
            if (databaseError != null) {
                future.completeExceptionally(new RuntimeException("Firebase error: " + databaseError.getMessage()));
            } else {
                future.complete(null);
            }
        });

        future.get();
    }

    /**
     * Update specific fields
     */
    public void update(String path, String id, Map<String, Object> updates)
            throws ExecutionException, InterruptedException {
        CompletableFuture<Void> future = new CompletableFuture<>();
        DatabaseReference ref = firebaseDatabase.getReference(ROOT_PATH + "/" + path + "/" + id);

        ref.updateChildren(updates, (databaseError, databaseReference) -> {
            if (databaseError != null) {
                future.completeExceptionally(new RuntimeException("Firebase error: " + databaseError.getMessage()));
            } else {
                future.complete(null);
            }
        });

        future.get();
    }

    /**
     * Delete an item
     */
    public void delete(String path, String id) throws ExecutionException, InterruptedException {
        CompletableFuture<Void> future = new CompletableFuture<>();
        DatabaseReference ref = firebaseDatabase.getReference(ROOT_PATH + "/" + path + "/" + id);

        ref.removeValue((databaseError, databaseReference) -> {
            if (databaseError != null) {
                future.completeExceptionally(new RuntimeException("Firebase error: " + databaseError.getMessage()));
            } else {
                future.complete(null);
            }
        });

        future.get();
    }

    /**
     * Clear entire database (admin only!)
     */
    public void clearDatabase() throws ExecutionException, InterruptedException {
        CompletableFuture<Void> future = new CompletableFuture<>();
        DatabaseReference ref = firebaseDatabase.getReference(ROOT_PATH);

        ref.removeValue((databaseError, databaseReference) -> {
            if (databaseError != null) {
                future.completeExceptionally(new RuntimeException("Firebase error: " + databaseError.getMessage()));
            } else {
                future.complete(null);
            }
        });

        future.get();
    }
}
