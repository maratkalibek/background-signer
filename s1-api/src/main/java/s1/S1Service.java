package s1;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@Slf4j
public class S1Service {

  @Autowired
  private TokenRepository tokenRepository;
  @Autowired
  private SignedTokenRepository signedTokenRepository;

  @GetMapping("/tokens")
  public ResponseEntity<List<Token>> toSign() {
    List<Token> tokens = tokenRepository.findAll();
    return ResponseEntity.ok(tokens);
  }

  @PostMapping("/save-signed")
  public ResponseEntity<Long> saveToken(@RequestBody SignedToken signedToken) {
    String subject = signedToken.getSubject();
    Token token = signedToken.getToken();
    if (!signedTokenRepository.existsByTokenAndSubject(token, subject)) {
      signedToken = signedTokenRepository.save(signedToken);
    } else {
      signedToken = signedTokenRepository.findByTokenAndSubject(token, subject);
    }
    return new ResponseEntity<>(signedToken.getId(), HttpStatus.CREATED);
  }

  @PostMapping("/save-token")
  public ResponseEntity<Long> saveToken(@RequestBody Token token) {
    tokenRepository.save(token);
    return new ResponseEntity<>(token.getId(), HttpStatus.CREATED);
  }

  @GetMapping("/signed/{id}")
  public ResponseEntity<SignedToken> signed(@PathVariable Long id) {
    SignedToken s = signedTokenRepository.findOne(id);
    return ResponseEntity.ok(s);
  }
}
