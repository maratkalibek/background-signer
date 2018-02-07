package s1;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SignedTokenRepository extends JpaRepository<SignedToken,Long> {
  boolean existsByTokenAndSubject(Token token, String subject);
  SignedToken findByTokenAndSubject(Token token, String subject);
}
