package com.cluelesscloset;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class CloudinaryService {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    public String upload(MultipartFile file) {
        try {
            byte[] fileBytes = file.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(fileBytes);
            String dataUri = "data:" + file.getContentType() + ";base64," + base64Image;

            String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
            String credentials = apiKey + ":" + apiSecret;
            String encodedCredentials = Base64.getEncoder()
                    .encodeToString(credentials.getBytes());

            String requestBody = "file=" + java.net.URLEncoder.encode(dataUri, "UTF-8")
                    + "&timestamp=" + timestamp
                    + "&folder=clueless-closet";

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload"))
                    .header("Authorization", "Basic " + encodedCredentials)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(request,
                    HttpResponse.BodyHandlers.ofString());

            return extractSecureUrl(response.body());

        } catch (IOException | InterruptedException e) {
            log.error("Cloudinary upload failed: {}", e.getMessage());
            throw new RuntimeException("Image upload failed", e);
        }
    }

    private String extractSecureUrl(String json) {
        Pattern pattern = Pattern.compile("\"secure_url\":\"([^\"]+)\"");
        Matcher matcher = pattern.matcher(json);
        if (matcher.find()) {
            return matcher.group(1).replace("\\/", "/");
        }
        throw new RuntimeException("Could not parse Cloudinary response: " + json);
    }
}
