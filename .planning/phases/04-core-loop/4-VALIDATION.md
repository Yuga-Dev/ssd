# Phase 4 Validation Strategy

**Verification Goals:**
- `startGame` securely fetches an unutilized word pair and correctly updates its Appwrite status to "used".
- Each connected client receives exclusively their required word (Crewmates get the Real Word, Imposter gets Imposter Word). No cross-pollination.
- A functional Hold-To-Reveal UX securely covers the mapped word on player devices.
- The Host timer correctly counts down exactly synchronized across networks.
- A manual `end_game` command triggered on the host flips the view universally displaying the explicit Imposter identity and word differences.
