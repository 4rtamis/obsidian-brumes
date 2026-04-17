export type ParsedToken =
    | { kind: 'power'; name: string } // {name}
    | { kind: 'weakness'; name: string } // {!name}
    | { kind: 'status'; name: string; value: string } // {name-<digits or empty>}
    | { kind: 'limit'; name: string; value: string } // {name:<digits or empty|~|->}  (not allowed in tags section, but we detect it)

const OUTER_BRACES = /^\{([\s\S]+)\}$/

export function normalizeWhitespace(s: string) {
    return s.replace(/\s+/g, ' ').trim()
}

function stripOuterBraces(raw: string) {
    const m = OUTER_BRACES.exec(raw.trim())
    return m ? m[1] : raw.trim()
}

function normalizeLimitValue(value: string | undefined) {
    return value === '-' ? '~' : (value ?? '')
}

/** Parse a single token according to your classifier. Accepts with or without outer braces. */
export function parseToken(raw: string): ParsedToken | null {
    if (!raw) return null
    const inner = stripOuterBraces(raw)

    // 1) weakness: {!name}
    if (inner.startsWith('!')) {
        const name = normalizeWhitespace(inner.slice(1))
        if (!name) return null
        return { kind: 'weakness', name }
    }

    // 2) limit: {name:<digits or empty|~|->}
    {
        const m = /^(.*?):(\d*|~|-)$/.exec(inner)
        if (m) {
            const name = normalizeWhitespace(m[1])
            const value = normalizeLimitValue(m[2])
            if (!name) return null
            return { kind: 'limit', name, value }
        }
    }

    // 3) status: {name-<digits or empty>}
    {
        const m = /^(.*?)-(\d*)$/.exec(inner)
        if (m) {
            const name = normalizeWhitespace(m[1])
            const value = m[2] ?? ''
            if (!name) return null
            // Allow any digits-or-empty (no min/max here; UI can advise typical 1–4)
            return { kind: 'status', name, value }
        }
    }

    // 4) power/tag: {name}
    {
        const name = normalizeWhitespace(inner)
        if (!name) return null
        return { kind: 'power', name }
    }
}

/** Formatters (always add braces) */
export function formatPower(name: string) {
    const n = normalizeWhitespace(name)
    return `{${n}}`
}
export function formatWeakness(name: string) {
    const n = normalizeWhitespace(name)
    return `{!${n}}`
}
export function formatStatus(name: string, value: string) {
    const n = normalizeWhitespace(name)
    // value can be "" (empty)
    return `{${n}-${value ?? ''}}`
}
export function formatLimit(name: string, value: string) {
    const n = normalizeWhitespace(name)
    return `{${n}:${value ?? ''}}`
}

/** Ensure a formatted token, using a default kind if parsing fails. */
export function ensureFormatted(
    raw: string,
    defaultKind: 'power' | 'weakness' | 'status',
    valueIfNeeded = ''
) {
    const parsed = parseToken(raw)
    if (parsed) {
        switch (parsed.kind) {
            case 'power':
                return formatPower(parsed.name)
            case 'weakness':
                return formatWeakness(parsed.name)
            case 'status':
                return formatStatus(parsed.name, parsed.value)
            case 'limit':
                return formatLimit(parsed.name, parsed.value)
        }
    }
    // Fallback on the chosen kind
    if (defaultKind === 'power') return formatPower(raw)
    if (defaultKind === 'weakness') return formatWeakness(raw)
    return formatStatus(raw, valueIfNeeded)
}

/** Case-insensitive comparison of two tokens by semantic meaning. */
export function tokensEqual(a: string, b: string) {
    const pa = parseToken(a)
    const pb = parseToken(b)
    if (!pa || !pb)
        return (
            normalizeWhitespace(a.toLowerCase()) ===
            normalizeWhitespace(b.toLowerCase())
        )
    if (pa.kind !== pb.kind) return false

    const an = 'name' in pa ? pa.name.toLowerCase() : ''
    const bn = 'name' in pb ? pb.name.toLowerCase() : ''

    if (pa.kind === 'power' || pa.kind === 'weakness') {
        return normalizeWhitespace(an) === normalizeWhitespace(bn)
    }
    // status/limit compare name + value (value can be "")
    const av = (pa as any).value ?? ''
    const bv = (pb as any).value ?? ''
    return (
        normalizeWhitespace(an) === normalizeWhitespace(bn) &&
        String(av) === String(bv)
    )
}
