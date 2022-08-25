/**
 * xxx
 */
const defaultConfig = {
    /** Dictionary of keywords and their respective scores, used during the scoring process. Use `.class`, `#id`, `+tag`, or `anything` formats. */
    keywords: {
        '+div ': 5,
        '+pre ': 5,
        '+section ': 5,
        '+p ': 10,
        'article': 25,
        'body': 25,
        'content': 25,
        'entry': 25,
        'hentry': 25,
        'main': 25,
        'page': 25,
        'post': 25,
        'text': 25,
        'blog': 25,
        'story': 25,
        'column': 25,
        '+dl ': -5,
        '+dt ': -5,
        '+dd ': -5,
        '+li ': -5,
        '+ol ': -5,
        '+td ': -5,
        '+ul ': -5,
        '.grid': -25,
        'attribution': -25,
        'blocks': -25,
        'combx': -25,
        'comment': -25,
        'contact': -25,
        'reference': -25,
        'foot': -25,
        'footer': -25,
        'footnote': -25,
        'infobox': -25,
        'masonry': -25,
        'masthead': -25,
        'media': -25,
        'meta': -25,
        'outbrain': -25,
        'promo': -25,
        'related': -25,
        'scroll': -25,
        'shoutbox': -25,
        'sidebar': -25,
        'sponsor': -25,
        'shopping': -25,
        'tags': -25,
        'tool': -25,
        'widget': -25,
        'community': -25,
        'disqus': -25,
        'extra': -25,
        'header': -25,
        'menu': -25,
        'remark': -25,
        'rss': -25,
        'shoutbox': -25,
        'sidebar': -25,
        'sponsor': -25,
        'ad-break': -25,
        'pagination': -25,
        'pager': -25,
        'popup': -25,
        'tweet': -25,
        'twitter': -25,
    },
    /** List of 'display' style values that indicate the element should be treated as a block element (e.g.: block, inline-block). */
    blockDisplayStyles: ['block', 'flex', 'grid', 'inline-block', 'inline-flex'],
    /** List of 'position' style values that indicate the element should be treated as a block element (e.g.: absolute). */
    blockPositionStyles: ['absolute', 'fixed', 'sticky'],
    /** List of html tags that display as a block element by default (e.g.: div, h1). */
    blockTags: ['address', 'article', 'aside', 'blockquote', 'br', 'canvas', 'dd', 'div', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'li', 'main', 'nav', 'noscript', 'ol', 'p', 'pre', 'section', 'table', 'td', 'th', 'tr', 'thead', 'tfoot', 'ul', 'video'],
    /** List of html tags that are often direct containers of text (e.g.: p, article). */
    readableTags: ['article', 'div', 'p', 'pre', 'section', 'span', 'td'],
    /** List of html tags that are often stacked sequentially as a list or grid (e.g.: li, p). */
    listableTags: ['dd', 'div', 'dl', 'dt', 'li', 'ol', 'p', 'td', 'ul'],
    /** List of html tags constituting section headers (e.g.: h1, h2) */
    headingTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    /** List of html tags that serve as non-display page infrastructure (e.g.: script, style, meta). */
    metaTags: ['head', 'link', 'meta', 'noscript', 'script', 'style'],
    /** List of html tags that do contain text but are often purely for annotations (e.g.: label, address, code). */
    descriptiveTags: ['address', 'blockquote', 'cite', 'code', 'figcaption', 'form', 'label', 'output', 'pre', 'sup', 'tfoot'],
    /** List of html tags for interactive, non-readable elements (e.g.: button, img, menu). */
    interactiveTags: ['button', 'canvas', 'dialog', 'embed', 'figure', 'frame', 'iframe', 'img', 'input', 'menu', 'menuitem', 'nav', 'object', 'select', 'svg', 'textarea', 'video'],
    /** List of html element roles for non-readable, interactive elements (e.g.: alert, banner, tooltip). */
    interactiveRoles: ['alert', 'alertdialog', 'banner', 'button', 'columnheader', 'combobox', 'dialog', 'directory', 'figure', 'heading', 'img', 'listbox', 'marquee', 'math', 'menu', 'menubar', 'menuitem', 'navigation', 'option', 'search', 'searchbox', 'status', 'toolbar', 'tooltip'],
    /** List of css classes of typical elements like div or span that xxx. */
    asideClasses: ['blogroll', 'caption', 'citation', 'comment', 'community', 'contact', 'copyright', 'extra', 'foot', 'footer', 'footnote', 'infobox', 'masthead', 'media', 'meta', 'metadata', 'mw-jump-link', 'mw-revision', 'navigation', 'navigation-not-searchable', 'noprint', 'outbrain', 'pager', 'popup', 'promo', 'reference', 'reference-text', 'references', 'related', 'related-articles', 'remark', 'rss', 's-popover', 'scroll', 'shopping', 'shoutbox', 'sidebar', 'sponsor', 'tag-cloud', 'tags', 'thumb', 'tool', 'user-info', 'widget', 'wikitable'],
    /** Minimum percentage (0-1) of text under an element that must be owned by a selector for the whole element to be considered a container of that selector. */
    containerRatioThreshold: 0.4,
    /** Maximum level to traverse upward when propagating text-length scores to parents. */
    textContainerTraversalDepth: 2,
}

class Escrape {
    /**
     * Constructs a new Escrape instance.
     * @param {object} config Configuration object. See documentation on `defaultConfig` and `setConfig`.
     * @param {HTMLElement} element Root element that will be scraped. Typically document.body.
     */
    constructor(config = defaultConfig, element = document.body) {
        this.setConfig(config)
        this.element = element
        this.iterator = 0
    }

    /**
     * Updates the configuration object with the config provided. If only a partial
     * object is supplied, then only those settings will be updated and any missing
     * settings will either stay their current value or, if unset, use the default
     * Escrape configuration for that setting.
     * @param {*} config Full or partial configuration object
     */
    setConfig(config) {
        this.config = {...defaultConfig, ...config}
    }

    /**
     * xxx
     * @returns {int} Incremented iteration number.
     */
    nextIteration() {
        return ++this.iterator
    }

    /**
     * Retrieves the host-provided description of the page based on meta tags or, if
     * meta tags are absent, common description elements.
     * @param {HTMLElement} The root DOM node to search for the page description. 
     * @returns {string} A string containing the page description if available.
     */
    getPageDescription(node = this.element) {
        const metas = node.querySelectorAll('meta[description],meta[name=description],meta[property=og\\:description]')
        for (const meta of metas) {
            if (meta.description)
                return meta.description
            if (meta.content)
                return meta.content
        }
        const shortDescription = node.querySelectorAll('.shortdescription')
        if (shortDescription.length == 1)
            return shortDescription[0].innerText

        return ''
    }

    /**
     * Retrieves the host-provided title of the page based on the H1 tag or, if there
     * is not precisely one h1, the title tag.
     * @param {HTMLElement} The root DOM node to search for the page title. 
     * @returns {string} A string containing the page title if available.
     */
    getPageTitle(node = this.element) {
        const h1s = node.querySelectorAll('h1')
        if (h1s.length == 1)
            return h1s[0].textContent
        if (node.ownerDocument.title)
            return node.ownerDocument.title.split(/( - | \| )/)[0].trim()
    }

    /**
     * Evaluates whether an element is a major container of descendents matching a selector.
     * For example, use selector `'h1, h2'` to determine if the percentage of text coming
     * from `h1`s and `h2`s or their descendents exceeds a threshold.
     * Excludes text from hidden and ignored elements.
     * @param {string} selector Css/query selector of elements that might, collectively, contain most text in the element.
     * @param {HTMLElement} node Element to evaluate.
     * @param {int} iteration Iteration number. See `nextIteration` method for explanation.
     * @returns {boolean}
     */
    isContainerOf(selector, node = this.element, iteration = this.iterator, ratioThreshold = this.configcontainerRatioThreshold) {
        //if (this.getTextLength(node, iteration) >= this.config.minimumTextLengthPerNode) {
        const fill = this.calculateTextFill(selector, node, iteration)
        return fill.textLengthRatio > ratioThreshold
        //}
    }

    *getContainersOf(selector, title = '', node = this.element, iteration = this.iterator) {
        const nodes = [...node.querySelectorAll(selector)]
        const property = `${title}Container`

        let currentNode
        while (currentNode = nodes.shift()) {
            this.setIterationValue(property, true, currentNode, iteration)
            yield currentNode

            const parent = currentNode.parentNode
            if (parent && this.getIterationValue(property, parent, iteration) == null) {
                const isContainer = this.isContainerOf(selector, parent, iteration) != false
                this.setIterationValue(property, isContainer, parent, iteration)
                if (isContainer)
                    nodes.push(parent)
            }
        }
    }

    *getHyperlinkContainers(node = this.element, iteration = this.iterator) {
        const selector = this.config.listableTags.join('>a:first-of-type,') + '>a:first-of-type'
        for (const n of node.querySelectorAll(selector)) {
            const parent = n.parentNode
            const fill = this.calculateTextFill('a', parent, iteration)
            if (fill.textLengthRatio > this.config.containerRatioThreshold)
                yield parent
        }
    }

    getReadableContainer(node = this.element, iteration = this.iterator) {
        let nodes = []
        const readableSelector = this.config.readableTags.join(',')
        for (const n of node.querySelectorAll(readableSelector)) {
            let weight = Math.min(this.getTextLength(n, iteration) / 100, 5)
            let i = this.config.textContainerTraversalDepth
            let p = n.parentNode
            
            while (p.parentNode && --i) {
                if (this.#score(weight, p, iteration))
                    nodes.push(p)
                weight /= 2
                p = p.parentNode
            }
        }

        let bestNode
        let bestScore = 0
        for (const n of nodes) {
            const score = this.getIterationValue('score', n, iteration)
            if (score > bestScore) {
                bestNode = n
                bestScore = score
            }
        }
        return bestNode
    }

    *getTextNodes(node = this.element, iteration = this.iterator, blockWrapper = document.createTextNode('\n')) {
        let isBlock = false

        for (let child = node.firstChild; child; child = child.nextSibling) {
            if (child.nodeType == Node.TEXT_NODE) {
                yield child
                isBlock = false
            } else if (child.nodeType == Node.ELEMENT_NODE
                && !this.isIgnored(child, iteration)
                && !this.isHidden(child)
            ) {
                const lastBlock = isBlock
                isBlock = blockWrapper && this.isBlockElement(child)
                if (isBlock && !lastBlock)
                    yield blockWrapper
                yield* this.getTextNodes(child, iteration)
                if (isBlock)
                    yield blockWrapper
            }
        }
    }

    /**
     * Returns the character count of the provided element and all its descendants,
     * excluding any hidden elements or elements marked as ignored. Text length is
     * cached at each level of the downstream hierarchy for the provided iteration.
     * @param {HTMLElement} node Element to evaluate.
     * @param {int} iteration Iteration number. See `nextIteration` method for explanation.
     * @returns {int} Character count of relevant text under this node.
     */
    getTextLength(node = this.element, iteration = this.iterator) {
        let len = this.getIterationValue('textlength', node, iteration) || 0
        if (!len) {
            for (let child = node.firstChild; child; child = child.nextSibling) {
                if (child.nodeType == Node.TEXT_NODE) {
                    len += child.textContent.replace(/\s+/g, ' ').trim().length
                } else if (child.nodeType == Node.ELEMENT_NODE
                    && !this.isIgnored(child, iteration)
                    && !this.isHidden(child)
                ) {
                    len += this.getTextLength(child, iteration)
                }
            }
            this.setIterationValue('textlength', len, node, iteration)
        }
        return len
    }
    
    calculateTextFill(selector, node = this.element, iteration = this.iterator) {
        const textLength = this.getTextLength(node, iteration)
        let selectedTextLength = 0

        if (textLength)
            for (const n of node.querySelectorAll(selector))
                if (!n.closest(selector) && !this.isIgnored(n, iteration) && !this.isHidden(n))
                    selectedTextLength += this.getTextLength(n, iteration)
        
        return {
            selectedTextLength,
            unselectedTextLength: textLength - selectedTextLength,
            textLengthRatio: textLength ? selectedTextLength / textLength : 0,
        }
    }

    extractReadableText(node = this.element, iteration = this.iterator) {
        let text = ''
        const readableNode = this.getReadableContainer(node, iteration)
        if (readableNode)
            for (const n of this.getTextNodes(readableNode, iteration))
                text += n.textContent
                    .replace(/[\r\n]+/g, '\n')
                    .replace(/[\t ]+/g, ' ')
        return text.trim()
    }

    /**
     * Retrieves a list of elements that provide basic page infrastructure, often
     * located in the page's `head` (e.g.: `script`, `style`, `meta`).
     * @param {HTMLElement} node Parent element under which to find meta elements.
     * @returns NodeListOf<any> List of elements matching the `config.metaTags` selector.
     */
    getMetaElements(node = this.element) {
        const selector = this.config.metaTags.join(',')
        return node.querySelectorAll(selector)
    }

    /**
     * Retrieves a list of elements that are typically noise, such as citations.
     * @param {HTMLElement} node Parent element under which to find aside elements.
     * @returns {NodeListOf<any>} List of elements matching the `config.asideClasses` selector.
     */
    getAsideElements(node = this.element) {
        const selector = '.' + this.config.asideClasses.join(',.')
        return node.querySelectorAll(selector)
    }

    /**
     * Retrieves a list of containers of display-oriented elements that are descriptive
     * (`h2`, `address`, etc.) or interactive (`button`, `menu`, etc.).
     * See `getContainersOf` for a better understanding of containers and thresholds. 
     * @param {HTMLElement} node Parent element under which to find aside elements.
     * @param {int} iteration Iteration number. See `nextIteration` method for explanation.
     * @returns {Generator<HTMLElement>} List of elements matching the `descriptiveTags`, `interactiveTags`, and `interactiveRoles` selectors.
     */
    getVisualContainers(node = this.element, iteration = this.iterator) {
        const selector = this.config.descriptiveTags.join(',')
            + ',' + this.config.interactiveTags.join(',')
            + ',[role=' + this.config.interactiveRoles.join('],[role=') + ']'
        return this.getContainersOf(selector, 'visual', node, iteration)
    }

    ignoreAll(iteration, ...elementLists) {
        for (const list of elementLists)
            for (const e of list)
                this.ignore(e, iteration)
    }

    ignore(node = this.element, iteration = this.iterator, ignore = true) {
        this.setIterationValue('ignored', ignore, node, iteration)
        this.setIterationValue('textlength', ignore ? 0 : undefined, node, iteration)
    }

    isIgnored(node = this.element, iteration = this.iterator) {
        return this.getIterationValue('ignored', node, iteration)
    }

    getIterationValue(property, node = this.element, iteration = this.iterator) {
        if (node._escrape && node._escrape[iteration])
            return node._escrape[iteration][property]
    }

    setIterationValue(property, value, node = this.element, iteration = this.iterator) {
        node._escrape ??= {}
        node._escrape[iteration] ??= {}
        node._escrape[iteration][property] = value        
    }

    /**
     * Determines whether the element is hidden (i.e., has zero impact to the document).
     * Elements that are 'visibility: hidden' are still considered visible because they
     * still have shape and therefore affect the flow of the document.
     * @param {HTMLElement} node Element to assess. 
     * @returns {boolean} Boolean indicating if the node is hidden.
     */
    isHidden(node = this.element) {
        return !node.offsetWidth && !node.getClientRects()
    }

    /**
     * Performantly estimates whether the node is 'probably' a block element based
     * on either the display or position style explicitly set on the element (i.e.,
     * not set via stylesheet), or, if none, the default display value of the tag.
     * @param {HTMLElement} node Element to assess. 
     * @returns {boolean} Boolean indicating if the node is probably block-style.
     */
    isBlockElement(node = this.element) {
        const display = node.style.display
        if (display && this.config.blockDisplayStyles.includes(display.toLowerCase()))
            return true
        const position = node.style.position
        if (position && this.config.blockPositionStyles.includes(position.toLowerCase()))
            return true
        return this.config.blockTags.includes(node.tagName.toLowerCase())
    }

    /**
     * Assigns an element a score based on the presence of keywords in the class,
     * tag name, or id. 
     * @param {int} weight Length-based incremental score to add to the element.
     * @param {HTMLElement} node Element to evaluate.
     * @param {int} iteration Iteration number. See `nextIteration` method for explanation.
     * @returns {boolean} `True` if calculating the initial score; `False` if updating the cached score.
     */
    #score(weight, node = this.element, iteration = this.iterator, keywords = this.config.keywords) {
        let score = this.getIterationValue('score', node, iteration)
        if (score != null) {
            this.setIterationValue('score', score + weight, node, iteration)
            return false
        }
        const tagName = node.tagName.toLowerCase()
        const searchStr =`.${node.className.toLowerCase()} #${node.id.toLowerCase()} +${tagName} `
        score = 0
        for (const k in keywords)
            if (searchStr.includes(k))
                score += this.config.keywords[k]
        this.setIterationValue('score', score + weight, node, iteration)
        return true
    }
}
