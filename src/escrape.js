const defaultConfig = {
    keywords: {
        '+div ': 5,
        '+pre ': 5,
        '+section ': 5,
        '+span ': 5,
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
    selectors: {
        blockDisplayStyles: ['block', 'flex', 'grid', 'inline-block', 'inline-flex'],
        blockTags: ['address', 'article', 'aside', 'blockquote', 'br', 'canvas', 'dd', 'div', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'li', 'main', 'nav', 'noscript', 'ol', 'p', 'pre', 'section', 'table', 'td', 'th', 'tr', 'thead', 'tfoot', 'ul', 'video'],
        readableTags: ['article', 'div', 'p', 'pre', 'section', 'span', 'td'],
        listableTags: ['dd', 'div', 'dl', 'dt', 'li', 'ol', 'p', 'td', 'ul'],
        headingTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        metaTags: ['head', 'link', 'meta', 'noscript', 'script', 'style'],
        descriptiveTags: ['address', 'blockquote', 'cite', 'code', 'figcaption', 'form', 'label', 'output', 'pre', 'sup', 'tfoot'],
        interactiveTags: ['button', 'canvas', 'dialog', 'embed', 'figure', 'frame', 'iframe', 'img', 'input', 'menu', 'menuitem', 'nav', 'object', 'select', 'svg', 'textarea', 'video'],
        interactiveRoles: ['alert', 'alertdialog', 'banner', 'button', 'columnheader', 'combobox', 'dialog', 'directory', 'figure', 'heading', 'img', 'listbox', 'marquee', 'math', 'menu', 'menubar', 'menuitem', 'navigation', 'option', 'search', 'searchbox', 'status', 'toolbar', 'tooltip'],
        asideClasses: ['blogroll', 'caption', 'citation', 'comment', 'community', 'contact', 'copyright', 'extra', 'foot', 'footer', 'footnote', 'infobox', 'masthead', 'media', 'meta', 'metadata', 'mw-jump-link', 'mw-revision', 'navigation', 'navigation-not-searchable', 'noprint', 'outbrain', 'pager', 'popup', 'promo', 'reference', 'reference-text', 'references', 'related', 'related-articles', 'remark', 'rss', 's-popover', 'scroll', 'shopping', 'shoutbox', 'sidebar', 'sponsor', 'tag-cloud', 'tags', 'thumb', 'tool', 'user-info', 'widget', 'wikitable'],
    },
    minimumTextLengthPerNode: 75,
    minimumTextLengthRatioPerContainer: 0.4,
    textContainerTraversalDepth: 2,
}

class Escrape {
    constructor(config = defaultConfig, element = document.body) {
        this.setConfig(config)
        this.element = element
        this.iterator = 0
    }

    setConfig(config) {
        this.config = {...defaultConfig, ...config}
    }

	getPageDescription() {
		const metas = this.element.querySelectorAll('meta[description],meta[name=description],meta[property=og\\:description]')
		for (const meta of metas) {
			if (meta.description)
				return meta.description
			if (meta.content)
				return meta.content
		}
		const shortDescription = this.element.querySelectorAll('.shortdescription')
		if (shortDescription.length == 1)
			return shortDescription[0].innerText

		return ''
	}

	getPageTitle(document) {
		const h1s = this.element.querySelectorAll('h1')
		if (h1s.length == 1)
			return h1s[0].textContent // TODO: Convert to method?
		return document.title.split(/( - | \| )/)[0].trim()
    }

    isSelectorContainer(selector, node = this.element, iteration = this.iterator) {
        if (this.getTextLength(node, iteration) >= this.config.minimumTextLengthPerNode) {
            const fill = this.calculateTextFill(selector, node, iteration)
            return fill.textLengthRatio > this.config.minimumTextLengthRatioPerContainer
        }
    }

    *getSelectorContainers(selector, title = '', node = this.element, iteration = this.iterator) {
        const nodes = [...node.querySelectorAll(selector)]
        const property = `${title}Container`

        let currentNode
        while (currentNode = nodes.shift()) {
            this.setIterationValue(property, true, currentNode, iteration)
            yield currentNode

            const parent = currentNode.parentNode
            if (parent && this.getIterationValue(property, parent, iteration) == null) {
                const isContainer = this.isSelectorContainer(selector, parent, iteration) != false
                this.setIterationValue(property, isContainer, parent, iteration)
                if (isContainer)
                    nodes.push(parent)
            }
        }
    }

    *getHyperlinkContainers(node = this.element, iteration = this.iterator) {
        const selector = this.config.selectors.listableTags.join('>a:first-of-type,') + '>a:first-of-type'
        for (const n of node.querySelectorAll(selector)) {
            const parent = n.parentNode
            const fill = this.calculateTextFill('a', parent, iteration)
            if (fill.textLengthRatio > this.config.maximumTextLengthRatio)
                yield parent
        }
    }

    getReadableContainer(node = this.element) {
        const top = this.getReadableContainers(1, node)
        return top && top[0]
    }

    getReadableContainers(topN = null, node = this.element, iteration = this.iterator) {
        const visualSelector = this.config.selectors.descriptiveTags.join(',')
            + ',' + this.config.selectors.interactiveTags.join(',')
            + ',[role=' + this.config.selectors.interactiveRoles.join('],[role=') + ']'

        for (const e of node.querySelectorAll(this.config.selectors.metaTags))
            this.ignore(e, iteration)
        for (const e of node.querySelectorAll('.' + this.config.selectors.asideClasses.join(',.')))
            this.ignore(e, iteration)
        for (const e of this.getSelectorContainers(visualSelector, 'visual', node, iteration))
            this.ignore(e, iteration)
        for (const e of this.getHyperlinkContainers(node, iteration))
            this.ignore(e, iteration)
        
        const nodes = []
        const readableSelector = this.config.selectors.readableTags.join(',')
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

        return nodes
            .filter(n => this.getIterationValue('score', n, iteration) > 0)
            .sort((a,b) => this.getIterationValue('score', b, iteration) - this.getIterationValue('score', a, iteration))
            .slice(0, topN || nodes.length)
    }

	extractReadableText(node = this.element, iteration = this.iterator) {
        let text = ''
        const topNodes = this.getReadableContainers(1, node)
        if (topNodes)
            for (const n of this.getTextNodes(topNodes[0], iteration))
                text += n.textContent
        return text
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

    calculateTextFill(selector, node = this.element, iteration = this.iterator) {
        const textLength = this.getTextLength(node, iteration)

        let selectedTextLength = 0
        for (const n of node.querySelectorAll(selector))
            if (!n.closest(selector) && !this.isIgnored(n, iteration) && !this.isHidden(n))
                selectedTextLength += this.getTextLength(n, iteration)
        
        return {
            selectedTextLength,
            unselectedTextLength: textLength - selectedTextLength,
            textLengthRatio: textLength ? selectedTextLength / textLength : 0,
        }
    }

    getTextLength(node = this.element, iteration = this.iterator) {
        let len = this.getIterationValue('textlength', node, iteration) || 0
        if (!len) {
            for (let child = node.firstChild; child; child = child.nextSibling) {
                if (child.nodeType == Node.TEXT_NODE) {
                    len += child.textContent.trim().length
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

    isIgnored(node = this.element, iteration = this.iterator) {
        return this.getIterationValue('ignored', node, iteration)
    }

    ignore(node = this.element, iteration = this.iterator, ignore = true) {
        this.setIterationValue('ignored', ignore, node, iteration)
        this.setIterationValue('textlength', ignore ? 0 : undefined, node, iteration)
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

    isHidden(node = this.element) {
        return !node.offsetWidth && !node.getClientRects()
    }

    isBlockElement(node = this.element) {
        const display = node.style.display.toLowerCase()
        if (display)
            return this.config.selectors.blockDisplayStyles.includes(display)
        return this.config.selectors.blockTags.includes(node.tagName.toLowerCase())
    }

    #score(weight, node = this.element, iteration = this.iterator) {
        let score = this.getIterationValue('score', node, iteration)
        if (score != null) {
            this.setIterationValue('score', score + weight, node, iteration)
            return false
        }
        const tagName = node.tagName.toLowerCase()
        const searchStr =`.${node.className.toLowerCase()} #${node.id.toLowerCase()} +${tagName} `
        score = 0
        for (const k in this.config.keywords)
            if (searchStr.includes(k))
                score += this.config.keywords[k]
        this.setIterationValue('score', score + weight, node, iteration)
        return true
    }
}
