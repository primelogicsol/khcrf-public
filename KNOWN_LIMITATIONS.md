# Known Limitations & Constraints

## State of Kashmir Crafts (SKC) Assessment Platform

This document outlines intentional limitations and constraints engineered into the SKC platform. These are not bugs; they are deliberate governance and architecture decisions required for RC-1 Institutional Certification.

---

## 1. Public Intelligence is Strictly Aggregate-Only

**Constraint:** The public dashboards (`/state-of-kashmir-crafts/*`) will never display a single, specific consultation response.
**Reason:** To protect stakeholder privacy and ensure that only fully vetted, synthesized findings are presented to the public. 
**Impact:** Deep-dive functionality (like clicking a district to see its exact submissions) is restricted to the Admin Dashboard.

## 2. Locked Public Features

**Constraint:** Certain buttons and features on the public platform are visually present but functionally locked (e.g., "Download Final Report", "Download Executive Summary", "Deep Archive Search").
**Reason:** The assessment lifecycle is ongoing. Presenting these states as locked builds public anticipation and demonstrates platform capability without leaking unpublished draft content.
**Resolution:** These will be unlocked via code updates only after formal publication approval by the governance board.

## 3. One-Way State Machine

**Constraint:** The workflow state machine generally moves forward. While an admin can theoretically revert a state in the DB, the UI is optimized for a forward-moving lifecycle.
**Reason:** Assessment data shouldn't wildly fluctuate backward in public aggregations (e.g., a "Validated" finding suddenly reverting to "Under Review" causing the public dashboard numbers to drop).

## 4. Eventual Consistency in Knowledge Graph

**Constraint:** The tagging of districts, crafts, and themes currently relies on exact string matching from the consultation form.
**Reason:** RC-1 prioritizes structured data capture over complex semantic parsing. 
**Future Scope:** Post-RC-1, an AI/Knowledge Graph layer will be introduced to perform semantic entity resolution (e.g., merging "Srinagar" and "srinagar city").
