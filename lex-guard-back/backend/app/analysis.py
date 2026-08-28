from dataclasses import dataclass


@dataclass(frozen=True)
class Evidence:
    document_id: str
    page: int | None
    quote: str
    confidence: float


@dataclass(frozen=True)
class Finding:
    code: str
    severity: str
    title: str
    rationale: str
    evidence: tuple[Evidence, ...]


def deterministic_review(text: str, document_id: str) -> list[Finding]:
    """Safe local provider: emits findings only when anchored in supplied text."""
    if "payment" not in text.lower():
        return []
    quote = next((line.strip() for line in text.splitlines() if "payment" in line.lower()), "payment")
    return [Finding("PAYMENT_TERM", "MEDIUM", "Payment term detected", "Review payment timing and conditions.", (Evidence(document_id, None, quote[:500], 0.82),))]
