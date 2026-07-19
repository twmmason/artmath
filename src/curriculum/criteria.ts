import type { Criterion, Strand } from "./types";

function c(
  code: string,
  strand: Strand,
  year: number,
  description: string,
): Criterion {
  const keyStage = year <= 2 ? "KS1" : year <= 6 ? "KS2" : "KS3";
  return { code, strand, keyStage, year, description };
}

/**
 * All 146 criteria: 81 KS1–KS2 DfE Ready-to-Progress items + 65 KS3
 * National Curriculum statements (docs/SECONDARY_national_curriculum_-_Mathematics.pdf).
 */
export const CRITERIA: Criterion[] = [
  // ─── NPV: Number & Place Value (21) ───────────────────────────────────
  c("1NPV-1", "NPV", 1, "Count within 100, forwards and backwards, starting with any number"),
  c("1NPV-2", "NPV", 1, "Reason about the location of numbers to 20 within the linear number system"),
  c("2NPV-1", "NPV", 2, "Recognise the place value of each digit in two-digit numbers"),
  c("2NPV-2", "NPV", 2, "Reason about the location of any two-digit number in the linear number system"),
  c("2NPV-3", "NPV", 2, "Count in multiples of 2, 5 and 10 and reason about them"),
  c("3NPV-1", "NPV", 3, "Know that 10 tens are equivalent to 1 hundred; work with hundreds, tens and ones"),
  c("3NPV-2", "NPV", 3, "Recognise the place value of each digit in three-digit numbers, and compose/decompose them"),
  c("3NPV-3", "NPV", 3, "Reason about the location of any three-digit number in the linear number system"),
  c("3NPV-4", "NPV", 3, "Divide 100 into 2, 4, 5 and 10 equal parts and read scales/number lines"),
  c("4NPV-1", "NPV", 4, "Know that 10 hundreds are equivalent to 1 thousand; work with four-digit numbers"),
  c("4NPV-2", "NPV", 4, "Recognise the place value of each digit in four-digit numbers, and compose/decompose them"),
  c("4NPV-3", "NPV", 4, "Reason about the location of any four-digit number in the linear number system"),
  c("4NPV-4", "NPV", 4, "Divide 1,000 into 2, 4, 5 and 10 equal parts; round to the nearest multiple of 1,000/100/10"),
  c("5NPV-1", "NPV", 5, "Know that 10 tenths are equivalent to 1 one; multiply and divide by 10, 100, 1,000"),
  c("5NPV-2", "NPV", 5, "Recognise the place value of decimals with up to 2 decimal places"),
  c("5NPV-3", "NPV", 5, "Reason about the location of decimal fractions in the linear number system; read scales"),
  c("5NPV-4", "NPV", 5, "Divide 1 into 2, 4, 5 and 10 equal parts; round decimals"),
  c("6NPV-1", "NPV", 6, "Understand the relationship between powers of 10 up to 10 million"),
  c("6NPV-2", "NPV", 6, "Recognise the place value of digits in numbers up to 10 million, including decimals"),
  c("6NPV-3", "NPV", 6, "Reason about the location of any number up to 10 million in the linear number system"),
  c("6NPV-4", "NPV", 6, "Divide powers of 10 into equal parts; read scales with labelled and unlabelled intervals"),

  // ─── NF: Number Facts (11) ────────────────────────────────────────────
  c("1NF-1", "NF", 1, "Fluently add and subtract within 10 (number bonds)"),
  c("1NF-2", "NF", 1, "Count forwards and backwards in multiples of 2, 5 and 10"),
  c("2NF-1", "NF", 2, "Fluently add and subtract within 20 using knowledge of bonds"),
  c("3NF-1", "NF", 3, "Secure fluency in addition and subtraction facts within 10"),
  c("3NF-2", "NF", 3, "Recall multiplication and division facts for the 10, 5, 2, 4 and 8 tables"),
  c("3NF-3", "NF", 3, "Apply place-value knowledge to known additive and multiplicative facts (scaling by 10)"),
  c("4NF-1", "NF", 4, "Recall multiplication and division facts up to 12 × 12"),
  c("4NF-2", "NF", 4, "Solve division problems with remainders using multiplication facts"),
  c("4NF-3", "NF", 4, "Apply place-value knowledge to known facts (scaling facts by 100)"),
  c("5NF-1", "NF", 5, "Secure fluency in multiplication and division facts; identify prime and composite numbers"),
  c("5NF-2", "NF", 5, "Apply place-value knowledge to known facts (scaling facts by 1 tenth or 1 hundredth)"),

  // ─── AS: Addition & Subtraction (9) ───────────────────────────────────
  c("1AS-1", "AS", 1, "Compose numbers to 10 from two parts and partition into parts"),
  c("1AS-2", "AS", 1, "Read, write and interpret number sentences with unknowns in different positions"),
  c("2AS-1", "AS", 2, "Add and subtract across 10"),
  c("2AS-2", "AS", 2, "Recognise subtraction as difference and finding how much more/less"),
  c("2AS-3", "AS", 2, "Add and subtract within 100 using knowledge of bonds and place value (complements to 100)"),
  c("2AS-4", "AS", 2, "Add and subtract two-digit numbers, including crossing the tens boundary"),
  c("3AS-1", "AS", 3, "Calculate complements to 100"),
  c("3AS-2", "AS", 3, "Add and subtract up to three-digit numbers using column methods"),
  c("3AS-3", "AS", 3, "Use inverse operations to check and solve missing-number problems"),

  // ─── MD: Multiplication & Division incl. 6AS/MD (16) ─────────────────
  c("2MD-1", "MD", 2, "Recognise repeated addition contexts and represent them with multiplication equations"),
  c("2MD-2", "MD", 2, "Relate grouping and sharing problems to multiplication and division"),
  c("3MD-1", "MD", 3, "Apply known multiplication and division facts to solve contextual problems"),
  c("3MD-2", "MD", 3, "Understand and use commutativity and links between multiplication and division"),
  c("4MD-1", "MD", 4, "Multiply and divide whole numbers by 10 and 100 in context"),
  c("4MD-2", "MD", 4, "Manipulate multiplication and division equations; understand distributivity"),
  c("4MD-3", "MD", 4, "Understand and apply the distributive property to multiply two-digit numbers"),
  c("5MD-1", "MD", 5, "Multiply and divide by 10, 100 and 1,000 including decimals"),
  c("5MD-2", "MD", 5, "Find factors and multiples; identify common factors"),
  c("5MD-3", "MD", 5, "Multiply up to four-digit numbers by one- and two-digit numbers using formal methods"),
  c("5MD-4", "MD", 5, "Divide up to four-digit numbers by one-digit numbers, interpreting remainders"),
  c("6MD-1", "MD", 6, "Use compact column multiplication and short/long division"),
  c("6AS/MD-1", "MD", 6, "Understand the difference between additive and multiplicative relationships"),
  c("6AS/MD-2", "MD", 6, "Use a given additive or multiplicative calculation to derive or complete a related one (inverse operations)"),
  c("6AS/MD-3", "MD", 6, "Solve problems involving ratio relationships"),
  c("6AS/MD-4", "MD", 6, "Solve problems with two unknowns"),

  // ─── F: Fractions (13) ────────────────────────────────────────────────
  c("3F-1", "F", 3, "Interpret and write unit fractions as parts of a whole"),
  c("3F-2", "F", 3, "Find unit and non-unit fractions of quantities"),
  c("3F-3", "F", 3, "Reason about the location of fractions less than 1 on a number line"),
  c("3F-4", "F", 3, "Add and subtract fractions with the same denominator within 1"),
  c("4F-1", "F", 4, "Reason about equivalence of fractions (fraction families)"),
  c("4F-2", "F", 4, "Convert between mixed numbers and improper fractions"),
  c("4F-3", "F", 4, "Add and subtract improper and mixed fractions with the same denominator"),
  c("5F-1", "F", 5, "Find non-unit fractions of quantities"),
  c("5F-2", "F", 5, "Find equivalent fractions and understand scaling numerator and denominator"),
  c("5F-3", "F", 5, "Recall decimal equivalents for common fractions (half, quarters, fifths, tenths)"),
  c("6F-1", "F", 6, "Simplify fractions by dividing numerator and denominator by common factors"),
  c("6F-2", "F", 6, "Compare fractions with different denominators using common denominators"),
  c("6F-3", "F", 6, "Recall decimal equivalents and convert between fractions, decimals and percentages"),

  // ─── G: Geometry (11) ─────────────────────────────────────────────────
  c("1G-1", "G", 1, "Recognise common 2D and 3D shapes in different orientations"),
  c("1G-2", "G", 1, "Compose 2D and 3D shapes from smaller shapes"),
  c("2G-1", "G", 2, "Describe properties of 2D and 3D shapes (sides, vertices, faces, edges)"),
  c("3G-1", "G", 3, "Recognise right angles and identify them in shapes"),
  c("3G-2", "G", 3, "Identify horizontal, vertical, parallel and perpendicular lines"),
  c("4G-1", "G", 4, "Identify and classify angles as acute, right or obtuse; understand symmetry"),
  c("4G-2", "G", 4, "Compare and order angles"),
  c("4G-3", "G", 4, "Describe positions on a 2D coordinate grid (first quadrant)"),
  c("5G-1", "G", 5, "Measure and draw angles in degrees using a protractor"),
  c("5G-2", "G", 5, "Translate shapes on a coordinate grid and reflect them"),
  c("6G-1", "G", 6, "Recognise properties of shapes including symmetry, and use them to solve problems"),

  // ═══ KS3 (65) ═════════════════════════════════════════════════════════

  // ─── KS3N: Number (16) ────────────────────────────────────────────────
  c("KS3N-1", "KS3N", 7, "Understand and use place value for decimals, measures and integers of any size"),
  c("KS3N-2", "KS3N", 7, "Order positive and negative integers, decimals and fractions; use =, ≠, <, >, ≤, ≥ and number lines"),
  c("KS3N-3", "KS3N", 7, "Use the concepts of prime numbers, factors, multiples, HCF, LCM and prime factorisation"),
  c("KS3N-4", "KS3N", 7, "Use the four operations applied to integers, decimals, proper/improper fractions and mixed numbers, all positive and negative"),
  c("KS3N-5", "KS3N", 7, "Use conventional notation for priority of operations, including brackets, powers, roots and reciprocals"),
  c("KS3N-6", "KS3N", 7, "Recognise and use relationships between operations including inverse operations"),
  c("KS3N-7", "KS3N", 7, "Use integer powers and associated real roots (square, cube and higher); recognise powers of 2, 3, 4, 5"),
  c("KS3N-8", "KS3N", 7, "Interpret and compare numbers in standard form A × 10ⁿ, 1 ≤ A < 10"),
  c("KS3N-9", "KS3N", 7, "Work interchangeably with terminating decimals and their corresponding fractions"),
  c("KS3N-10", "KS3N", 7, "Define percentage as parts per hundred; interpret percentages and percentage changes, including over 100%"),
  c("KS3N-11", "KS3N", 7, "Interpret fractions and percentages as operators"),
  c("KS3N-12", "KS3N", 7, "Use standard units of mass, length, time, money and other measures with decimal quantities"),
  c("KS3N-13", "KS3N", 7, "Round numbers and measures to an appropriate degree of accuracy (decimal places, significant figures)"),
  c("KS3N-14", "KS3N", 7, "Use approximation through rounding to estimate answers; use error intervals a ≤ x < b"),
  c("KS3N-15", "KS3N", 7, "Use a calculator and other technologies to calculate results accurately and interpret them appropriately"),
  c("KS3N-16", "KS3N", 7, "Appreciate the infinite nature of the sets of integers, real and rational numbers"),

  // ─── KS3A: Algebra (16) ───────────────────────────────────────────────
  c("KS3A-1", "KS3A", 7, "Use and interpret algebraic notation (ab, 3y, a², brackets, coefficients)"),
  c("KS3A-2", "KS3A", 7, "Substitute numerical values into formulae and expressions, including scientific formulae"),
  c("KS3A-3", "KS3A", 7, "Understand and use the concepts and vocabulary of expressions, equations, inequalities, terms and factors"),
  c("KS3A-4", "KS3A", 7, "Simplify and manipulate algebraic expressions; collect like terms, multiply out brackets, factorise"),
  c("KS3A-5", "KS3A", 7, "Understand and use standard mathematical formulae; rearrange formulae to change the subject"),
  c("KS3A-6", "KS3A", 7, "Model situations or procedures by translating them into algebraic expressions or formulae"),
  c("KS3A-7", "KS3A", 7, "Use algebraic methods to solve linear equations in one variable"),
  c("KS3A-8", "KS3A", 7, "Work with coordinates in all four quadrants"),
  c("KS3A-9", "KS3A", 7, "Recognise, sketch and produce graphs of linear and quadratic functions"),
  c("KS3A-10", "KS3A", 7, "Interpret mathematical relationships both algebraically and graphically"),
  c("KS3A-11", "KS3A", 7, "Reduce a given linear equation in two variables to the form y = mx + c; calculate and interpret gradients and intercepts"),
  c("KS3A-12", "KS3A", 7, "Use linear and quadratic graphs to estimate values and solve simultaneous equations approximately"),
  c("KS3A-13", "KS3A", 7, "Find approximate solutions to contextual problems from given graphs (piece-wise linear, exponential, reciprocal)"),
  c("KS3A-14", "KS3A", 7, "Generate terms of a sequence from term-to-term or position-to-term rules"),
  c("KS3A-15", "KS3A", 7, "Recognise arithmetic sequences and find the nth term"),
  c("KS3A-16", "KS3A", 7, "Recognise geometric sequences and appreciate other sequences that arise"),

  // ─── KS3R: Ratio, Proportion & Rates of Change (10) ──────────────────
  c("KS3R-1", "KS3R", 7, "Change freely between related standard units (time, length, area, volume, mass)"),
  c("KS3R-2", "KS3R", 7, "Use scale factors, scale diagrams and maps"),
  c("KS3R-3", "KS3R", 7, "Express one quantity as a fraction of another"),
  c("KS3R-4", "KS3R", 7, "Use ratio notation, including reduction to simplest form"),
  c("KS3R-5", "KS3R", 7, "Divide a given quantity into two parts in a given part:part or part:whole ratio"),
  c("KS3R-6", "KS3R", 7, "Understand that a multiplicative relationship between two quantities can be expressed as a ratio or a fraction"),
  c("KS3R-7", "KS3R", 7, "Relate the language of ratios and the associated calculations to fractions and to linear functions"),
  c("KS3R-8", "KS3R", 7, "Solve problems involving percentage change, including original value problems and simple interest"),
  c("KS3R-9", "KS3R", 7, "Solve problems involving direct and inverse proportion"),
  c("KS3R-10", "KS3R", 7, "Use compound units such as speed, unit pricing and density to solve problems"),

  // ─── KS3G: Geometry & Measures (16) ───────────────────────────────────
  c("KS3G-1", "KS3G", 7, "Use formulae for perimeter and area of triangles, parallelograms and trapezia; volume of cuboids, prisms and cylinders"),
  c("KS3G-2", "KS3G", 7, "Calculate and solve problems involving perimeters and areas of circles and composite shapes"),
  c("KS3G-3", "KS3G", 7, "Draw and measure line segments and angles, including interpreting scale drawings"),
  c("KS3G-4", "KS3G", 7, "Derive and use standard ruler and compass constructions; perpendicular bisector, angle bisector"),
  c("KS3G-5", "KS3G", 7, "Describe, sketch and draw using conventional terms: parallel, perpendicular, polygons, symmetry"),
  c("KS3G-6", "KS3G", 7, "Use standard conventions for labelling triangles; know criteria for congruence (SSS, SAS, ASA, RHS)"),
  c("KS3G-7", "KS3G", 7, "Derive and illustrate properties of triangles, quadrilaterals and circles"),
  c("KS3G-8", "KS3G", 7, "Identify properties of, and describe, translations, rotations and reflections"),
  c("KS3G-9", "KS3G", 7, "Identify and construct congruent triangles; construct similar shapes by enlargement"),
  c("KS3G-10", "KS3G", 7, "Apply properties of angles at a point, on a straight line, and vertically opposite angles"),
  c("KS3G-11", "KS3G", 7, "Understand and use alternate and corresponding angles on parallel lines"),
  c("KS3G-12", "KS3G", 7, "Derive and use the sum of angles in a triangle to deduce angle sums in polygons"),
  c("KS3G-13", "KS3G", 7, "Derive results and illustrate them geometrically, including Pythagoras' theorem; simple proofs"),
  c("KS3G-14", "KS3G", 7, "Use Pythagoras' theorem and trigonometric ratios in similar triangles to solve right-angled triangle problems"),
  c("KS3G-15", "KS3G", 7, "Use the properties of faces, surfaces, edges and vertices of 3-D solids to solve problems"),
  c("KS3G-16", "KS3G", 7, "Interpret mathematical relationships both algebraically and geometrically"),

  // ─── KS3P: Probability (4) ────────────────────────────────────────────
  c("KS3P-1", "KS3P", 7, "Record and analyse frequency of outcomes; understand probability on the 0–1 scale and fairness"),
  c("KS3P-2", "KS3P", 7, "Understand that the probabilities of all possible outcomes sum to one"),
  c("KS3P-3", "KS3P", 7, "Enumerate sets and unions/intersections of sets using tables, grids and Venn diagrams"),
  c("KS3P-4", "KS3P", 7, "Generate theoretical sample spaces and use them to calculate theoretical probabilities"),

  // ─── KS3S: Statistics (3) ─────────────────────────────────────────────
  c("KS3S-1", "KS3S", 7, "Describe, interpret and compare distributions using mean, median, mode, range and outliers"),
  c("KS3S-2", "KS3S", 7, "Construct and interpret tables, charts and diagrams, including bar charts, pie charts and grouped data"),
  c("KS3S-3", "KS3S", 7, "Describe simple mathematical relationships between two variables in bivariate data; illustrate with scatter graphs"),
];

export const CRITERIA_BY_CODE: Map<string, Criterion> = new Map(
  CRITERIA.map((cr) => [cr.code, cr]),
);

export const KS2_CRITERIA = CRITERIA.filter((cr) => cr.keyStage !== "KS3");
export const KS3_CRITERIA = CRITERIA.filter((cr) => cr.keyStage === "KS3");

export function criteriaForStrand(strand: Strand): Criterion[] {
  return CRITERIA.filter((cr) => cr.strand === strand);
}