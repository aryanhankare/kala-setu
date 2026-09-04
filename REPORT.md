# KalaSetu
Prototype video:  https://drive.google.com/file/d/1Mtr00TGBwFBZU8zgtLS3Xqb6v8j4Fu1a/view?usp=sharing
## AI-Powered Blockchain Marketplace for Indian Artisans

### Technical & Project Documentation

**Project:** KalaSetu
**Purpose:** Empowering Indian artisans through AI, digital storytelling, blockchain-based authenticity, and direct digital payments.

---

# 1. Executive Summary

KalaSetu is a digital marketplace designed to help Indian artisans bring their handmade products into the digital economy while preserving the identity and story behind each craft.

Traditional e-commerce platforms generally focus on the product as a commodity. KalaSetu instead attempts to preserve three important aspects of an artisan's work:

* The **product**
* The **artisan's story**
* The **authenticity of the craft**

The prototype combines artificial intelligence, regional-language processing, blockchain technology, decentralized storage, and a marketplace interface.

The core workflow is:

**Artisan → Voice/Image Input → AI Processing → Digital Craft Story → Blockchain Authentication → Marketplace → Direct Artisan Support**

The prototype uses **Google Gemini 1.5 Flash** for AI-generated narratives, **Bhashini** for regional-language speech-to-text, **Algorand** for blockchain-based craft identity and transactions, **IPFS/Pinata** for decentralized metadata storage, and **Supabase/PostgreSQL** for off-chain application data.

---

# 2. Problem Statement

India has a large artisan community producing traditional handicrafts, textiles, pottery, metalwork, paintings, bamboo products and other forms of cultural craftsmanship.

However, artisans face several barriers when attempting to participate in digital commerce.

### 2.1 Digital exclusion

Many artisans are not comfortable with English-centric digital platforms or complicated product-listing workflows.

Creating an online listing can require:

* Writing product descriptions
* Choosing categories
* Adding keywords
* Uploading images
* Communicating product history
* Managing digital profiles

KalaSetu attempts to reduce this burden through voice-first and AI-assisted interaction.

### 2.2 Loss of artisan identity

On conventional marketplaces, the product can become separated from its creator.

A handmade object may be displayed simply as:

> "Handmade Basket — ₹999"

without communicating:

* Who made it
* Where it came from
* What tradition it represents
* Why the technique is important

KalaSetu attempts to attach the artisan's narrative to the digital representation of the craft.

### 2.3 Authenticity and counterfeit concerns

Traditional crafts can be reproduced or misrepresented online.

KalaSetu uses blockchain-based identifiers and metadata to create a verifiable digital record associated with a craft.

### 2.4 Intermediary dependence

Traditional supply chains may contain multiple intermediaries between the artisan and customer.

KalaSetu explores direct digital interaction and direct micro-tipping through blockchain infrastructure.

---

# 3. Proposed Solution

KalaSetu combines several technologies rather than treating AI as a standalone chatbot.

The overall concept is:

```text
                ARTISAN
                   │
                   ▼
        Voice + Craft Image
                   │
                   ▼
             AI PROCESSING
          ┌────────┴────────┐
          │                 │
      Bhashini           Gemini
   Speech-to-Text       AI Narrative
          │                 │
          └────────┬────────┘
                   ▼
          DIGITAL CRAFT STORY
                   │
                   ▼
             ARTISAN REVIEW
                   │
                   ▼
          BLOCKCHAIN IDENTITY
                   │
                   ▼
           VERIFIED CRAFT
                   │
                   ▼
             MARKETPLACE
                   │
          ┌────────┴────────┐
          ▼                 ▼
       BUYERS        DIRECT SUPPORT
```

The goal is to make digital participation easier while giving the artisan greater control over their representation.

---

# 4. System Architecture

KalaSetu can be understood as multiple technical layers.

## 4.1 Frontend Layer

The frontend provides the user-facing interface.

The documented prototype uses:

* React
* Vite
* Tailwind CSS

The interface contains the artisan onboarding workflow and craft discovery experience.

Major frontend functions include:

* Artisan onboarding
* Voice upload
* Craft image upload
* AI story generation
* Craft gallery
* Craft detail view
* Blockchain verification information
* Tipping interface

---

# 5. Backend Layer

The backend acts as the orchestration layer between the frontend and external services.

The documented architecture uses:

**FastAPI + Python**

The backend is responsible for receiving frontend requests and communicating with:

* AI services
* Speech services
* Blockchain services
* IPFS
* Database

Conceptually:

```text
Frontend
   │
   │ API Request
   ▼
FastAPI Backend
   │
   ├────────► Gemini
   │
   ├────────► Bhashini
   │
   ├────────► Algorand
   │
   ├────────► IPFS / Pinata
   │
   └────────► Supabase
```

This separation also prevents sensitive API credentials from being placed directly inside the frontend.

---

# 6. AI Architecture

The AI layer is one of KalaSetu's main differentiating components.

The documented AI stack includes:

### Google Gemini 1.5 Flash

Used for generating polished narratives from artisan-provided information.

### Bhashini

Used for speech-to-text processing for Indian regional languages.

### Google Vision API

The project documentation identifies Vision API integration as being prepared for craft classification.

Therefore, the AI architecture can be represented as:

```text
        ARTISAN VOICE
              │
              ▼
          BHASHINI
              │
              ▼
       TEXT TRANSCRIPTION
              │
              ├──────────────┐
              │              │
              ▼              ▼
        CRAFT IMAGE      ARTISAN DATA
              │              │
              └──────┬───────┘
                     ▼
               GEMINI AI
                     │
                     ▼
          AI-GENERATED STORY
                     │
                     ▼
              FINAL CRAFT
              DESCRIPTION
```

---

# 7. Multilingual Voice Workflow

A key part of the system is reducing the requirement for artisans to type long English descriptions.

The intended workflow is:

```text
Artisan speaks
      ↓
Regional language audio
      ↓
Bhashini Speech-to-Text
      ↓
Text representation
      ↓
Gemini
      ↓
Polished craft narrative
```

The project documentation describes support for 12+ Indian languages in the voice-first workflow and bilingual narrative generation.

This creates a more accessible interface for artisans who are more comfortable speaking than typing.

---

# 8. AI Narrative Generation

The purpose of Gemini in the prototype is not simply to provide chatbot responses.

It transforms raw artisan information into a marketplace-friendly narrative.

For example:

### Raw artisan input

```text
"This basket is made from bamboo.
I learned this work from my mother.
It takes around two days."
```

### AI-generated representation

The system can transform this information into a polished product story suitable for a marketplace.

The important distinction is:

```text
Raw information
       ↓
AI processing
       ↓
Structured / polished narrative
       ↓
Marketplace presentation
```

The AI therefore acts as a communication layer between the artisan and the digital marketplace.

---

# 9. Human-in-the-Loop Design

AI-generated information should not automatically become the final truth.

KalaSetu follows a more appropriate model:

```text
AI generates
     ↓
Artisan reviews
     ↓
Artisan approves / edits
     ↓
Final version
     ↓
Blockchain registration
```

This is particularly important because AI can generate incorrect information.

For example, an AI system should not independently determine facts such as:

* Exact material
* Exact geographic origin
* Historical authenticity
* Artisan ownership
* Production cost

unless that information has been provided or verified.

The artisan should remain the final authority over their story and product information.

---

# 10. Blockchain Layer

Blockchain is used to create a digital identity and verification mechanism for crafts.

The prototype documentation describes the use of:

**Algorand**

for craft-related blockchain operations.

The conceptual workflow is:

```text
Approved Craft
      ↓
Metadata generated
      ↓
Metadata stored
      ↓
NFT / Digital Asset
      ↓
Algorand Blockchain
      ↓
Unique digital identity
```

This creates a persistent blockchain record associated with the craft.

---

# 11. Why Blockchain?

The blockchain component addresses the authenticity problem.

A normal database is controlled by the application.

Blockchain provides a distributed ledger where transactions and asset records can be independently verified.

For KalaSetu, this can provide:

* Craft identity
* Transaction history
* Verification
* Ownership information
* Tamper-resistant records

The prototype uses Algorand's Asset Standard / NFT approach for craft identity.

---

# 12. IPFS and Metadata

Blockchain is not intended to store large images directly.

KalaSetu therefore separates the blockchain record from the actual metadata/media storage.

Conceptually:

```text
Craft Image + Metadata
          │
          ▼
      IPFS / Pinata
          │
          ▼
     Content Identifier
          │
          ▼
      Blockchain
```

The blockchain can reference the decentralized metadata rather than storing the entire image.

The project documentation specifies Pinata/IPFS for decentralized metadata storage.

---

# 13. Database Layer

The system also requires conventional application data storage.

The documented stack uses:

**Supabase / PostgreSQL**

for off-chain indexing and application data.

A simplified database structure could contain:

```text
ARTISANS
──────────────
id
name
location
language
wallet_address

CRAFTS
──────────────
id
artisan_id
name
category
description
image_url
story
nft_id
created_at

TRANSACTIONS
──────────────
id
craft_id
artisan_id
amount
transaction_hash
timestamp
```

The blockchain handles blockchain-specific records while the database handles application-level querying.

---

# 14. Craft Discovery

The buyer-facing portion of the prototype provides a craft discovery experience.

The documented functionality includes:

* Gallery view
* Craft filtering
* Craft details
* Artisan stories
* Location information
* Blockchain verification
* Direct tipping

This changes the marketplace experience from simply browsing products to discovering the people and culture behind those products.

---

# 15. Direct Artisan Support

KalaSetu also explores direct micro-tipping.

The documented prototype uses:

**ALGO / USDC**

for direct digital support through Algorand infrastructure.

Conceptually:

```text
Buyer
  │
  │ Tip
  ▼
Algorand Network
  │
  ▼
Artisan Wallet
```

This creates a direct payment path without requiring the platform to act as an intermediary for the transfer.

---

# 16. Authentication and Wallets

The blockchain component gives artisans a wallet-based digital identity.

The documented implementation includes wallet generation and wallet integration for artisan transactions.

The broader architecture therefore contains two types of identity:

### Application identity

Handled by the web application/database.

### Blockchain identity

Represented through the artisan's blockchain wallet.

These can be associated with the same artisan record.

---

# 17. Complete Technical Data Flow

The complete system can be represented as:

```text
                     ARTISAN
                        │
                        ▼
              ┌──────────────────┐
              │ Voice + Image    │
              │ Product Details  │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  React Frontend  │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  FastAPI Backend │
              └────────┬─────────┘
                       │
            ┌──────────┼──────────┐
            ▼          ▼          ▼
        Bhashini    Gemini     Vision
            │          │          │
            └──────────┼──────────┘
                       ▼
               AI CRAFT STORY
                       │
                       ▼
                ARTISAN REVIEW
                       │
                       ▼
              ┌─────────────────┐
              │ Metadata / IPFS │
              └────────┬────────┘
                       │
                       ▼
                ┌─────────────┐
                │  Algorand   │
                │ NFT / Asset │
                └──────┬──────┘
                       │
                       ▼
                CRAFT GALLERY
                       │
              ┌────────┴────────┐
              ▼                 ▼
           BUYER             ARTISAN
                              SUPPORT
```

---

# 18. Technology Stack

| Layer                 | Technology               | Purpose                                 |
| --------------------- | ------------------------ | --------------------------------------- |
| Frontend              | React                    | User interface                          |
| Frontend tooling      | Vite                     | Development/build tooling               |
| Styling               | Tailwind CSS             | UI styling                              |
| Backend               | FastAPI                  | API orchestration                       |
| Backend language      | Python                   | Server-side logic                       |
| AI                    | Gemini 1.5 Flash         | Narrative generation                    |
| Speech                | Bhashini                 | Indian-language speech-to-text          |
| Vision                | Google Vision API        | Craft classification integration        |
| Blockchain            | Algorand                 | Digital craft identity and transactions |
| Blockchain SDK        | Algorand SDK             | Blockchain interaction                  |
| Smart contracts       | PyTeal                   | Blockchain logic                        |
| Decentralized storage | IPFS / Pinata            | Metadata storage                        |
| Database              | Supabase / PostgreSQL    | Application data                        |
| Wallet                | Pera Wallet / AlgoSigner | Blockchain interaction                  |
| Deployment            | Vercel / cloud backend   | Hosting                                 |

The technologies above are based on the project's documented architecture and implementation notes.

---

# 19. Security Considerations

The architecture separates frontend and backend responsibilities.

API credentials should remain server-side rather than being embedded in the browser.

The intended flow is:

```text
Frontend
   ↓
Backend
   ↓
External API
```

rather than:

```text
Frontend
   ↓
Secret API Key
   ↓
External API
```

This reduces the risk of exposing service credentials.

Additional production considerations include:

* Input validation
* File-size validation
* Authentication
* Authorization
* Rate limiting
* Secure environment variables
* Wallet security
* AI output validation
* Database access policies

---

# 20. What Is Implemented vs Future Scope

It is important to distinguish the working prototype from future development.

## Prototype / documented implementation

The project documentation identifies the following core functionality:

* React-based frontend
* Artisan onboarding
* Voice and image upload
* Gemini AI narrative generation
* Bhashini integration
* Craft gallery
* Craft detail views
* Algorand integration
* NFT/craft identity workflow
* IPFS metadata workflow
* Direct tipping
* Blockchain verification interface

The documentation describes the project as an MVP with portions of the blockchain and advanced functionality still being developed.

## Future scope

Potential extensions include:

* More regional languages
* Voice-first complete navigation
* Advanced craft classification
* Artisan analytics
* Specialized Indian handicraft AI models
* GI-tag registry integration
* Secondary marketplace
* Automated royalty distribution
* Mobile application
* Better authenticity scoring

---

# 21. AI Limitations

AI should not be treated as an unquestionable source of truth.

Potential limitations include:

### Incorrect classification

The AI may misunderstand a craft when images are unclear.

### Hallucination

The AI may generate details that were not explicitly provided.

### Cultural context

Traditional craft techniques can contain cultural information that a general AI model may not fully understand.

### Language interpretation

Regional dialects and uncommon terminology may affect speech recognition.

### Solution

KalaSetu can address these limitations through:

```text
AI suggestion
      ↓
Artisan verification
      ↓
Correction
      ↓
Final approved information
```

This is why the human-in-the-loop design is important.

---

# 22. Scalability

The current architecture is modular.

Each major service can be scaled independently.

For example:

```text
Frontend
   │
   ▼
API Layer
   │
   ├── AI Service
   ├── Speech Service
   ├── Database
   ├── Storage
   └── Blockchain
```

As the number of artisans increases, the application can introduce:

* API load balancing
* Background processing
* Caching
* Queue-based AI requests
* Database indexing
* Object storage
* Monitoring
* Rate limiting

The AI service can also eventually be supplemented by a specialized handicraft dataset.

---

# 23. Future Specialized AI Model

The prototype currently relies on existing foundation models rather than training a large model from scratch.

A future KalaSetu dataset could contain:

```text
Craft Image
+
Craft Name
+
Region
+
Material
+
Technique
+
Artisan Verification
```

For example:

```text
10,000+ verified craft records
          ↓
Specialized dataset
          ↓
Fine-tuning / specialized AI
          ↓
Better Indian craft recognition
```

This could eventually allow KalaSetu to recognize regional crafts more accurately.

---

# 24. Social Impact

KalaSetu is designed around more than simply selling products.

The intended impact includes:

### Digital inclusion

Reduce the amount of typing and technical knowledge required to participate in online commerce.

### Cultural preservation

Preserve the story and context surrounding traditional crafts.

### Authenticity

Provide a verifiable digital identity for crafts.

### Artisan visibility

Allow buyers to discover the maker rather than seeing only an anonymous product.

### Direct support

Enable digital micro-tipping and direct financial interaction.

---

# 25. Why KalaSetu Is Different

The project can be summarized through four connected ideas:

```text
             KALASETU
                 │
      ┌──────────┼──────────┐
      ▼          ▼          ▼
     AI       BLOCKCHAIN   VOICE
      │          │          │
      ▼          ▼          ▼
  Storytelling Authenticity Accessibility
      │          │          │
      └──────────┼──────────┘
                 ▼
          ARTISAN MARKETPLACE
```

Rather than using AI, blockchain and voice technology as unrelated features, KalaSetu connects them around one problem:

> **How can traditional artisans participate in the digital economy without losing their identity, story and connection to their craft?**

---

# 26. Demonstration Flow

The recommended demonstration sequence is:

### Step 1 — Landing Page

Introduce KalaSetu and its purpose.

### Step 2 — Artisan Onboarding

Show the artisan entering basic information and providing voice/image input.

### Step 3 — AI Processing

Demonstrate the AI-generated narrative.

Explain:

> "The artisan doesn't have to manually write a polished marketplace story. Their input is processed through our AI layer."

### Step 4 — Review

Show that the generated information can be reviewed.

Explain the human-in-the-loop concept.

### Step 5 — Authentication

Show the blockchain/NFT-related verification flow.

### Step 6 — Marketplace

Show the craft gallery and individual craft details.

### Step 7 — Direct Support

Demonstrate the tipping mechanism if available during the live demo.

---

# 27. Technical Explanation for Judges

If a judge asks:

### "What AI model are you using?"

Answer:

> "We're using Google's Gemini 1.5 Flash for AI-generated craft narratives. We also integrate Bhashini for regional-language speech-to-text, while Google Vision is part of the planned craft-classification layer."

### "Did you train the AI yourself?"

Answer:

> "No. For the prototype, we're using existing foundation models through APIs. Our contribution is the application architecture, domain-specific prompting, artisan workflow and integration with the marketplace and blockchain layers."

### "Why blockchain?"

Answer:

> "Blockchain gives each registered craft a verifiable digital identity and provides a transparent transaction record, which helps address authenticity and trust."

### "Why use AI?"

Answer:

> "The AI reduces the digital communication burden on artisans by converting their raw input into a polished digital representation of their craft."

### "Can AI make mistakes?"

Answer:

> "Yes. That's why we use a human-in-the-loop approach. AI generates the initial content, but the artisan remains responsible for reviewing and approving it."

---

# 28. One-Line Technical Architecture

**KalaSetu is a React–FastAPI application that combines Gemini-based AI narrative generation, Bhashini speech processing, Algorand blockchain verification, IPFS metadata storage, and Supabase-based application data to create a digitally accessible marketplace for artisans.**

---

# 29. Conclusion

KalaSetu combines AI, regional-language interaction and blockchain technology to create a more artisan-centric digital marketplace.

The central idea is not simply to put handicrafts online.

It is to transform:

**Artisan → Product → Story → Verified Digital Identity → Marketplace**

while reducing the technical and linguistic barriers involved in entering the digital economy.

The prototype demonstrates how existing AI and blockchain infrastructure can be combined into a practical system that gives traditional crafts greater digital visibility while keeping the artisan at the center of the process.

---

## References

1. KalaSetu project repository and technical documentation.
2. Google Gemini AI documentation.
3. Bhashini language technology platform.
4. Algorand developer documentation.
5. IPFS / Pinata documentation.
6. Supabase / PostgreSQL documentation.
7. Google Cloud Vision documentation.
