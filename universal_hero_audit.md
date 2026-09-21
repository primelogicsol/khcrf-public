# Universal Hero Audit

## Overview
This document serves as an audit of the existing hero implementations across the HCRF platform prior to migration to the `UniversalEditorialHero` system.

## 1. Homepage Hero
- **Route**: `/`
- **Source Component**: `frontend/src/components/Hero.tsx`
- **Content Source**: Hardcoded
- **Layout Type**: Custom carousel overlay
- **Title**: "An ecosystem where art and artisans flourish"
- **CTA Count**: 0 (in hero body), handled in sub-sections
- **Media Type**: Static images
- **Carousel Support**: Yes (custom rotation)
- **Admin Management**: No
- **Responsive Behavior**: Yes, standard stacking
- **Accessibility**: Missing standard aria-live attributes and prefers-reduced-motion checks.
- **Action**: **Migrated to `UniversalEditorialHero`.** Replaced in Stage 1. Legacy component to be removed in final cleanup.

## 2. Master Artisans Hero
- **Route**: `/master-artisans`
- **Source Component**: `frontend/src/app/(main)/master-artisans/page.tsx`
- **Content Source**: Hardcoded
- **Layout Type**: Cinematic Background
- **Title**: "MASTER ARTISANS of KASHMIR"
- **Description**: "Documenting the living custodians of Kashmir's craft traditions..."
- **CTA Count**: 3
- **Media Type**: Static image
- **Carousel Support**: No
- **Admin Management**: No
- **Responsive Behavior**: Yes
- **Accessibility**: Minimal.
- **Action**: **Migrated to `UniversalEditorialHero`.** Replaced in Stage 1. 

## 3. Current Assessment Hero
- **Route**: `/state-of-kashmir-crafts/current-assessment-2026`
- **Source Component**: `frontend/src/app/(main)/state-of-kashmir-crafts/current-assessment-2026/CurrentAssessmentClient.tsx`
- **Content Source**: Hardcoded
- **Layout Type**: Cinematic Background with specific overlay opacity
- **Title**: "State of Kashmir Crafts 2026"
- **CTA Count**: 4
- **Media Type**: Static background pattern image
- **Carousel Support**: No
- **Admin Management**: No
- **Responsive Behavior**: Yes
- **Accessibility**: Minimal.
- **Action**: **Migrated to `UniversalEditorialHero`.** Replaced in Stage 1.

## 4. Publications Landing Hero
- **Route**: `/publications`
- **Source Component**: `frontend/src/components/publications/PublicationsHero.tsx`
- **Content Source**: Hardcoded
- **Layout Type**: Split Layout (Text left, Graphic right)
- **Title**: "Publications & Research"
- **CTA Count**: 2
- **Media Type**: Graphic/Image
- **Carousel Support**: No
- **Admin Management**: No
- **Action**: To be migrated in Stage 2.

## 5. Research & Policy Hero
- **Route**: `/research`
- **Source Component**: Assumed embedded in `page.tsx`
- **Content Source**: Hardcoded
- **Layout Type**: Standard Banner
- **Carousel Support**: No
- **Admin Management**: No
- **Action**: To be migrated in Stage 2.

## 6. Business Support & About Pages
- **Routes**: `/business-support`, `/about`
- **Source Components**: Embedded
- **Layout Type**: Static headers
- **Carousel Support**: No
- **Admin Management**: No
- **Action**: To be migrated in Stage 2.

## Summary of Findings
Prior to this upgrade, every route utilized an independent hero implementation. None of them supported database-driven slide management, scheduling, targeted phases, or integrated analytics. The migration to `UniversalEditorialHero` eliminates this fragmentation and establishes a singular, highly configurable, and accessible foundation.
